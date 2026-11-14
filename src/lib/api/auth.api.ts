import {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "@/types/domain";
import { apiRequest, getApiMode } from "./client";

interface NestJsAuthResponse {
  accessToken?: string;
  user: {
    id: string;
    email: string;
    name?: string;
    fullName?: string;
    role: "USER" | "ADMIN" | "COMPANY_OWNER" | "SYSTEM_ADMIN";
    emailVerified?: boolean;
    onboardingCompleted?: boolean;
    companyId?: string;
    createdAt?: string;
    business?: { id: string; name: string } | null;
  };
  expiresAt?: string;
  isSimulated?: boolean;
}

function normalizeAuthSession(raw: NestJsAuthResponse | AuthSession): AuthSession {
  if ("isSimulated" in raw && "expiresAt" in raw && "fullName" in raw.user) {
    return raw as AuthSession;
  }
  const nest = raw as NestJsAuthResponse;
  return {
    accessToken: nest.accessToken,
    user: {
      id: nest.user.id,
      email: nest.user.email,
      fullName: nest.user.fullName || nest.user.name || "Business Owner",
      role:
        nest.user.role === "ADMIN" || nest.user.role === "SYSTEM_ADMIN"
          ? "SYSTEM_ADMIN"
          : "COMPANY_OWNER",
      emailVerified: nest.user.emailVerified ?? true,
      onboardingCompleted: nest.user.onboardingCompleted ?? true,
      // Platform admins are not bound to any client company.
      companyId:
        nest.user.role === "ADMIN" || nest.user.role === "SYSTEM_ADMIN"
          ? undefined
          : nest.user.companyId || nest.user.business?.id || "cmp_live_01",
      createdAt: nest.user.createdAt || new Date().toISOString(),
    },
    expiresAt:
      nest.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    isSimulated: false,
  };
}

export const authApi = {
  login: async (payload: LoginRequest) => {
    const res = await apiRequest<NestJsAuthResponse | AuthSession>(
      "POST",
      "/auth/login",
      {
        email: payload.email,
        password: payload.password,
      }
    );
    return {
      ...res,
      data: normalizeAuthSession(res.data),
    };
  },

  register: async (payload: RegisterRequest) => {
    // In live NestJS mode, RegisterDto expects { email, password, name, businessName }
    const requestBody =
      getApiMode() === "live"
        ? {
            email: payload.email,
            password: payload.password,
            name: payload.fullName,
            businessName: payload.companyName,
          }
        : payload;

    const res = await apiRequest<NestJsAuthResponse | AuthSession>(
      "POST",
      "/auth/register",
      requestBody
    );
    return {
      ...res,
      data: normalizeAuthSession(res.data),
    };
  },

  verifyEmail: (payload: VerifyEmailRequest) =>
    apiRequest<{ verified: boolean; verifiedAt: string }>(
      "POST",
      "/auth/verify-email",
      payload
    ),

  resendVerification: (payload: ResendVerificationRequest) =>
    apiRequest<{ sent: boolean; email: string; dispatchedAt: string }>(
      "POST",
      "/auth/resend-verification",
      payload
    ),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiRequest<{ sent: boolean; email: string; dispatchedAt: string }>(
      "POST",
      "/auth/forgot-password",
      payload
    ),

  resetPassword: (payload: ResetPasswordRequest) =>
    apiRequest<{ updated: boolean; updatedAt: string }>(
      "POST",
      "/auth/reset-password",
      payload
    ),
};
