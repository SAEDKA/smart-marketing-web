# Role-switch label fix (on top of ROLES_FIX.md)

## Problem

The profile-dropdown button that *switches* the active account was labelled
"Active Role" in all three UI languages (EN "Active Role", TR "Aktif Rol",
AR "الدور النشط"), while the chip on its right showed the *target* account
("→ Client" / "← العميل"). Read together — "Active Role: Client" — it told a
signed-in System Admin that his active role is "Client", the exact opposite
of the button's meaning. The dictionary key was always `switchRole`; only its
text was wrong, since the original code.

## Changes (labels only, no behaviour change)

- `src/lib/i18n/locales/en.ts` — `switchRole`: "Active Role" → "Switch Role"
- `src/lib/i18n/locales/tr.ts` — `switchRole`: "Aktif Rol" → "Rol Değiştir"
- `src/lib/i18n/locales/ar.ts` — `switchRole`: "الدور النشط" → "تبديل الدور"
- `src/components/layout/TopHeader.tsx` — target chip now names the full
  account, matching the sidebar/mobile switcher: "→ Client Account" /
  "→ Admin Account", "→ Müşteri Hesabı" / "→ Admin Hesabı",
  "← حساب العميل" / "← حساب الأدمن".

The current role is still shown as the badge under the user's name in the
same dropdown ("System Admin" / "مدير النظام"), so the row now reads as an
action: "Switch Role → Client Account".

`switchRole` text is used only by this button (TopHeader label, GlassSidebar
tooltip); no other screen displays it.
