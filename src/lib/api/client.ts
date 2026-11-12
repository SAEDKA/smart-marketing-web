import { ApiErrorShape, ApiResponse, AuthSession } from "@/types/domain";
import { mockRequestHandler } from "./mock-adapter";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3000/api/v1";

const API_MODE: "mock" | "live" =
  process.env.NEXT_PUBLIC_API_MODE === "live" ? "live" : "mock";

const STORAGE_SESSION_KEY = "smp_auth_session";

export function getApiMode(): "mock" | "live" {
  return API_MODE;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

function getStoredBearerToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed?.accessToken;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  if (API_MODE === "mock") {
    return mockRequestHandler<T>(method, endpoint, body);
  }

  try {
    const token = getStoredBearerToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let parsedError: Partial<ApiErrorShape> & { message?: string | string[] } = {};
      try {
        parsedError = await response.json();
      } catch {
        // Ignore non-JSON error body
      }

      const rawMessage = Array.isArray(parsedError.message)
        ? parsedError.message.join(", ")
        : parsedError.message;

      const errorShape: ApiErrorShape = {
        code:
          response.status === 401
            ? "UNAUTHORIZED"
            : response.status === 403
            ? "FORBIDDEN"
            : response.status === 400
            ? "VALIDATION_ERROR"
            : "SERVER_ERROR",
        message:
          rawMessage ||
          `Backend API returned status ${response.status}`,
        fieldErrors: parsedError.fieldErrors,
        status: response.status,
      };
      throw errorShape;
    }

    const json = await response.json();
    return {
      data: (json.data ?? json) as T,
      meta: {
        timestamp: new Date().toISOString(),
        mode: "live",
      },
    };
  } catch (err) {
    if ((err as ApiErrorShape)?.code) {
      throw err;
    }
    const networkErr: ApiErrorShape = {
      code: "NETWORK_ERROR",
      message:
        "Unable to reach the NestJS backend API (/api/v1). Check network connectivity.",
      status: 0,
    };
    throw networkErr;
  }
}
