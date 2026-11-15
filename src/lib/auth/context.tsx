"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthSession,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from "@/types/domain";
import { authApi } from "@/lib/api/auth.api";

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  simulateSessionExpiry: () => void;
  clearSessionExpiry: () => void;
  setSession: (session: AuthSession | null) => void;
}

const STORAGE_SESSION_KEY = "smp_auth_session";

// Default initial demo session to allow immediate, smooth exploration
const DEFAULT_INITIAL_SESSION: AuthSession = {
  user: {
    id: "usr_owner_01",
    email: "sarah@lumierecoffee.com",
    fullName: "Sarah Jenkins",
    role: "COMPANY_OWNER",
    emailVerified: true,
    onboardingCompleted: true,
    companyId: "cmp_lumiere_01",
    createdAt: "2026-10-01T09:00:00.000Z",
  },
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
  isSimulated: true,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        // Refresh simulated demo sessions automatically so they don't expire overnight
        if (new Date(parsed.expiresAt).getTime() < Date.now()) {
          const refreshed: AuthSession = {
            ...parsed,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          };
          setSessionState(refreshed);
          window.localStorage.setItem(
            STORAGE_SESSION_KEY,
            JSON.stringify(refreshed)
          );
        } else {
          setSessionState(parsed);
        }
      } else {
        // Use default demo session for first-time convenience
        setSessionState(DEFAULT_INITIAL_SESSION);
        window.localStorage.setItem(
          STORAGE_SESSION_KEY,
          JSON.stringify(DEFAULT_INITIAL_SESSION)
        );
      }
    } catch {
      setSessionState(DEFAULT_INITIAL_SESSION);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const res = await authApi.login(payload);
      saveSession(res.data);
      setIsSessionExpired(false);
    },
    [saveSession]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const res = await authApi.register(payload);
      saveSession(res.data);
      setIsSessionExpired(false);
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    saveSession(null);
    setIsSessionExpired(false);
    router.push("/login");
  }, [saveSession, router]);

  const switchRole = useCallback(
    (role: UserRole) => {
      if (!session) return;
      const updated: AuthSession = {
        ...session,
        user: {
          ...session.user,
          role,
          // The platform admin belongs to no company; the client
          // account belongs to its own company only.
          companyId:
            role === "SYSTEM_ADMIN"
              ? undefined
              : DEFAULT_INITIAL_SESSION.user.companyId,
          email:
            role === "SYSTEM_ADMIN"
              ? "admin@smartmarketing.ai"
              : "sarah@lumierecoffee.com",
          fullName:
            role === "SYSTEM_ADMIN"
              ? "Kemal Arslan"
              : "Sarah Jenkins",
        },
      };
      saveSession(updated);
      router.push(role === "SYSTEM_ADMIN" ? "/admin" : "/dashboard");
    },
    [session, saveSession, router]
  );

  const simulateSessionExpiry = useCallback(() => {
    setIsSessionExpired(true);
    saveSession(null);
  }, [saveSession]);

  const clearSessionExpiry = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Memoized for the same reason as I18nProvider: an inline object
  // here re-rendered every useAuth() consumer on every provider render.
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session ? session.user : null,
      isLoading,
      isAuthenticated: !!session && !isSessionExpired,
      isSessionExpired,
      login,
      register,
      logout,
      switchRole,
      simulateSessionExpiry,
      clearSessionExpiry,
      setSession: saveSession,
    }),
    [
      session,
      isLoading,
      isSessionExpired,
      login,
      register,
      logout,
      switchRole,
      simulateSessionExpiry,
      clearSessionExpiry,
      saveSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
