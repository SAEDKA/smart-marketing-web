import { describe, it, expect } from "vitest";
import { authApi } from "@/lib/api/auth.api";

describe("R1 Authentication & Recovery API (WEB-01-03, WEB-01-04)", () => {
  it("rejects login with invalid email format (400 validation error)", async () => {
    await expect(
      authApi.login({ email: "invalid-email", password: "Password123!" })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("authenticates valid company owner credentials", async () => {
    const res = await authApi.login({
      email: "sarah@lumierecoffee.com",
      password: "Lumiere2026!",
    });
    expect(res.data.user.role).toBe("COMPANY_OWNER");
    expect(res.data.user.email).toBe("sarah@lumierecoffee.com");
    expect(res.meta.mode).toBe("mock");
  });

  it("authenticates system admin credentials", async () => {
    const res = await authApi.login({
      email: "admin@company.com",
      password: "AdminRoot2026!",
    });
    expect(res.data.user.role).toBe("SYSTEM_ADMIN");
  });

  it("blocks locked accounts with 403 FORBIDDEN", async () => {
    await expect(
      authApi.login({
        email: "locked@company.com",
        password: "Password123!",
      })
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
  });

  it("registers a new company and marks onboarding false (WEB-01-06 prep)", async () => {
    const res = await authApi.register({
      fullName: "Alex Rivera",
      companyName: "Rivera Coffee Lab",
      email: "alex@rivera.coffee",
      password: "Password2026!",
    });
    expect(res.data.user.fullName).toBe("Alex Rivera");
    expect(res.data.user.onboardingCompleted).toBe(false);
  });

  it("handles valid email verification token (WEB-01-04)", async () => {
    const res = await authApi.verifyEmail({ token: "valid_token_123" });
    expect(res.data.verified).toBe(true);
    expect(res.data.verifiedAt).toBeDefined();
  });

  it("rejects expired verification token with 410 TOKEN_EXPIRED", async () => {
    await expect(
      authApi.verifyEmail({ token: "expired_token" })
    ).rejects.toMatchObject({
      code: "TOKEN_EXPIRED",
      status: 410,
    });
  });

  it("sends resend-verification request", async () => {
    const res = await authApi.resendVerification({ email: "sarah@lumierecoffee.com" });
    expect(res.data.sent).toBe(true);
    expect(res.data.email).toBe("sarah@lumierecoffee.com");
  });

  it("handles forgot password and reset password flow", async () => {
    const forgotRes = await authApi.forgotPassword({ email: "sarah@lumierecoffee.com" });
    expect(forgotRes.data.sent).toBe(true);

    const resetRes = await authApi.resetPassword({
      token: "valid_token",
      password: "NewPassword2026!",
      confirmPassword: "NewPassword2026!",
    });
    expect(resetRes.data.updated).toBe(true);
  });
});
