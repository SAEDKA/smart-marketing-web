import { describe, it, expect, afterEach } from "vitest";
import { authApi } from "@/lib/api/auth.api";
import { companyApi } from "@/lib/api/company.api";
import { productsApi } from "@/lib/api/products.api";
import { campaignsApi } from "@/lib/api/campaigns.api";
import { postsApi } from "@/lib/api/posts.api";
import { socialApi } from "@/lib/api/social.api";
import { analyticsApi } from "@/lib/api/analytics.api";
import { reportsApi } from "@/lib/api/reports.api";
import type { AuthUser } from "@/types/domain";

/**
 * Per-account data isolation in the mock API layer.
 *
 * The mock adapter resolves the caller's workspace from the user stored
 * in the "smp_auth_session" localStorage entry (the client passes it as
 * the principal). No stored session → the seeded Lumiere demo workspace,
 * which is what the pre-existing suites rely on. A signed-in owner must
 * only ever see his own company's data.
 */

const SESSION_KEY = "smp_auth_session";

function storeSession(user: AuthUser) {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      isSimulated: true,
    })
  );
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

const NOUR_PRE_ONBOARDING: AuthUser = {
  id: "usr_owner_nour",
  email: "nour@nurstore.com",
  fullName: "Nour Haddad",
  role: "COMPANY_OWNER",
  emailVerified: true,
  onboardingCompleted: true,
  // Deliberately NO companyId: a signed-in owner without a company.
  createdAt: "2026-11-15T09:00:00.000Z",
};

const SARAH: AuthUser = {
  id: "usr_owner_01",
  email: "sarah@lumierecoffee.com",
  fullName: "Sarah Jenkins",
  role: "COMPANY_OWNER",
  emailVerified: true,
  onboardingCompleted: true,
  companyId: "cmp_lumiere_01",
  createdAt: "2026-10-01T09:00:00.000Z",
};

afterEach(() => {
  window.localStorage.clear();
});

describe("Mock API per-account data isolation", () => {
  it("defaults to the Lumiere demo workspace when no session is stored", async () => {
    clearSession();
    const res = await productsApi.getProducts();
    expect(res.data.length).toBeGreaterThan(0);
    expect(
      res.data.every((p) => p.companyId === "cmp_lumiere_01")
    ).toBe(true);
  });

  it("gives a signed-in owner without a company an empty workspace", async () => {
    storeSession(NOUR_PRE_ONBOARDING);

    const products = await productsApi.getProducts();
    expect(products.data).toEqual([]);

    const campaigns = await campaignsApi.getCampaigns();
    expect(campaigns.data).toEqual([]);

    const posts = await postsApi.getPosts();
    expect(posts.data).toEqual([]);

    const accounts = await socialApi.getAccounts();
    expect(accounts.data).toEqual([]);

    const summary = await analyticsApi.getSummary();
    expect(summary.data.reach).toBe(0);

    const swot = await reportsApi.getSwotReport();
    expect(swot.data.hasSufficientData).toBe(false);
  });

  it("walks Nour end to end: onboarding creates HER workspace, isolated from Lumiere", async () => {
    clearSession();

    const login = await authApi.login({
      email: "nour@nurstore.com",
      password: "Nour2026!",
    });
    // Fresh owner: no company until onboarding completes.
    expect(login.data.user.companyId).toBeUndefined();
    storeSession(login.data.user);

    const saved = await companyApi.saveOnboarding({
      companyName: "Nur Store",
      industry: "Retail",
      description: "Test",
      communicationTone: "PROFESSIONAL",
      preferredLanguage: "en",
    });
    expect(saved.data.id).toBeTruthy();
    expect(saved.data.id).not.toBe("cmp_lumiere_01");
    expect(saved.data.companyName).toBe("Nur Store");

    // The client session now carries her company id (completeOnboarding).
    storeSession({
      ...login.data.user,
      companyId: saved.data.id,
      onboardingCompleted: true,
    });

    const created = await productsApi.createProduct({
      name: "Nur Dates Box",
      description: "Premium dates gift box",
      category: "Retail",
      price: 19.99,
      status: "ACTIVE",
    });
    expect(created.data.companyId).toBe(saved.data.id);

    const hers = await productsApi.getProducts();
    expect(hers.data).toHaveLength(1);
    expect(hers.data[0].id).toBe(created.data.id);
    expect(hers.data[0].companyId).toBe(saved.data.id);

    // Back to the default (Sarah) view: Lumiere's catalog is intact and
    // does NOT contain Nour's product.
    clearSession();
    const lumiere = await productsApi.getProducts();
    expect(lumiere.data.length).toBeGreaterThan(0);
    expect(lumiere.data.some((p) => p.id === created.data.id)).toBe(false);
    expect(
      lumiere.data.every((p) => p.companyId === "cmp_lumiere_01")
    ).toBe(true);

    // Sarah's company profile is still Lumiere — Nour's onboarding did
    // not rename it.
    storeSession(SARAH);
    const profile = await companyApi.getProfile();
    expect(profile.data.id).toBe("cmp_lumiere_01");
    expect(profile.data.companyName).toBe("Lumiere Artisan Roasters");
  });

  it("registering creates an isolated empty workspace and never renames Lumiere", async () => {
    clearSession();

    const reg = await authApi.register({
      fullName: "Layla Haddad",
      companyName: "Layla Boutique",
      email: "layla@layla-boutique.com",
      password: "Password123!",
    });
    expect(reg.data.user.companyId).toBeDefined();
    expect(reg.data.user.companyId).not.toBe("cmp_lumiere_01");
    expect(reg.data.user.onboardingCompleted).toBe(false);

    storeSession(reg.data.user);
    const products = await productsApi.getProducts();
    expect(products.data).toEqual([]);

    const profile = await companyApi.getProfile();
    expect(profile.data.id).toBe(reg.data.user.companyId);
    expect(profile.data.companyName).toBe("Layla Boutique");

    // Registering must not have renamed the Lumiere demo company.
    clearSession();
    const lumiereProfile = await companyApi.getProfile();
    expect(lumiereProfile.data.id).toBe("cmp_lumiere_01");
    expect(lumiereProfile.data.companyName).toBe("Lumiere Artisan Roasters");
  });
});
