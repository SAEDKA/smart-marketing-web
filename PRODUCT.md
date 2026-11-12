# SMART MARKETING PLATFORM — Product Context (`PRODUCT.md`)

## 1. Product Identity & Mission
**SMART MARKETING PLATFORM** (`smart-marketing-web`) is an AI-powered social media marketing workspace built specifically for small and medium-sized businesses (SMBs) that do not have dedicated in-house marketing teams.

Rather than feeling like a generic admin template, the product operates as an **intelligent marketing assistant and creative command center** that guides business owners from initial brand configuration to AI content generation, human review, social publishing, and evidence-based SWOT intelligence.

## 2. Target Audience & Use Scene
- **Primary Users:** Small and medium business owners, boutique founders, specialty retail/hospitality operators (`COMPANY_OWNER`), and platform operations administrators (`SYSTEM_ADMIN`).
- **Supported Languages & Locales:**
  - **English (`en` — LTR)**
  - **Turkish (`tr` — LTR)**
  - **Arabic (`ar` — RTL)**
- **Supported Devices:**
  - **Desktop & Widescreen (`1024px` – `1440px+`):** Fixed/collapsible Liquid Glass sidebar, contextual top header with breadcrumbs, multi-column workspace grids, and split-screen AI Content Studio.
  - **Mobile (`360px` – `430px`):** Dedicated touch-first bottom navigation bar + slide-over glass navigation drawer, single-column stacked workflows, and zero horizontal overflow.

## 3. Core 14-Step User Journey
1. Company Registration (`/register`)
2. Company Onboarding Wizard (`/onboarding`)
3. Brand Configuration (`/settings/brand`)
4. Product & Media Management (`/products`)
5. Campaign Creation Wizard (`/campaigns`)
6. AI Content Generation (`/content-studio`)
7. Post Editing & Version History (`/posts`)
8. Explicit Human Review & Approval (`/posts`)
9. Social Account Connection — Instagram Professional & Facebook Pages (`/integrations`)
10. Publishing Calendar & Scheduling (`/calendar`)
11. Publication Status & Error Recovery (`/calendar`)
12. Performance Analytics Dashboard (`/analytics`)
13. Evidence-Based SWOT Reports (`/reports`)
14. Actionable Marketing Recommendations, Notifications & Admin Governance (`/reports`, `/notifications`, `/admin`)

## 4. Technical & Architectural Boundaries
- **Frontend Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS, Lucide Icons, Vitest + React Testing Library.
- **Backend Boundary:** Communicates exclusively via typed HTTP contracts under `/api/v1` with the NestJS backend (`smart-marketing-backend`). Never connects directly to PostgreSQL or exposes OAuth tokens in client storage.
- **Dual API Mode:** Supports live NestJS REST API (`NEXT_PUBLIC_API_MODE=live`) with Bearer JWT authentication (`Authorization: Bearer <token>`) and a realistic, isolated Mock API Adapter (`NEXT_PUBLIC_API_MODE=mock`) for standalone demonstration and testing.
- **MVP Scope Discipline:** Supports Instagram Professional (Business/Creator) and Facebook Pages on web. Excludes personal profiles, TikTok/LinkedIn/X, paid ads checkout, e-commerce order processing, and AI video generation.
