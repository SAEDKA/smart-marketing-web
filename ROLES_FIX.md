# Roles fix — platform admin vs client (company owner)

Applies **on top of** `navigation-fix.patch`. Scope is deliberately narrow,
as requested: only the two roles and their names/labels — no feature,
layout, or design changes. The demo session and the demo role switcher
are untouched (they are test tooling; removing the demo is the owner's
own planned step). Verified: `npm run build` passes, tests pass.

## The intended model

- **SYSTEM_ADMIN — the platform/site owner.** Manages the whole site:
  platform overview, visitor/usage statistics, companies & customers,
  complaints/support, operations & logs. He is not a client and does
  not belong to any company.
- **COMPANY_OWNER — the client.** A customer company account. He only
  manages his own company: products, campaigns, AI content, posts,
  publishing, and his own company's analytics. He is not an admin.

The menus and pages were already separated this way. The mix-up was in
three specific places:

## What was wrong and what changed

1. **The admin account was bound to a client's company.**
   - Mock login gave the SYSTEM_ADMIN session `companyId` of the demo
     client company (Lumiere). Now: admin sessions carry no `companyId`;
     client sessions keep theirs (`mock-adapter.ts`).
   - The live-mode auth mapping forced a fallback company id onto every
     user, admins included. Now admins map to no company (`auth.api.ts`).
   - The demo role switcher kept the client's `companyId` when switching
     to admin. Now switching to SYSTEM_ADMIN clears it, and switching
     back to COMPANY_OWNER restores the client company
     (`lib/auth/context.tsx`).
   - `AuthUser.companyId` is now optional in the types, documented as
     client-only (`types/domain.ts`).

2. **The admin could open the client's workspace.**
   The workspace layout only bounced the admin away from `/dashboard`;
   direct URLs like `/products` or `/campaigns` opened a company's
   workspace for him. Now a SYSTEM_ADMIN is confined to his own area —
   `/admin`, `/notifications`, `/settings` — and any other workspace
   route redirects him to `/admin` (`app/(workspace)/layout.tsx`).
   The reverse direction already existed: clients opening `/admin`
   get the Unauthorized view.

3. **Labels that called the client an administrator.**
   - Account-settings subtitle (EN): "Manage your **administrator**
     profile … **platform** localization preferences" → "Manage your
     profile, security credentials, and interface language
     preferences." Same fix in TR ("Yönetici profilinizi…" →
     neutral). AR was already neutral.
   - The role switcher called the two roles "**Customer View / Admin
     View**" — as if they were two views of one account. Renamed to
     "**Client Account / Admin Account**" (حساب العميل / حساب الأدمن,
     Müşteri Hesabı / Admin Hesabı) in the sidebar and mobile drawer.
   - The header switcher named the client "→ Owner" in EN/TR while AR
     said "العميل". Unified to Client / Müşteri / العميل.

## Tests

`auth.test.ts` now asserts the binding both ways: a company-owner
login carries its company id, and a system-admin login carries none.
