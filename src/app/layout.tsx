import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { ThemeProvider } from "@/lib/theme/context";

export const metadata: Metadata = {
  title: "SMART MARKETING — AI-Powered Social Media Marketing Platform",
  description:
    "Enterprise-grade AI marketing workspace for growing businesses. Liquid Glass design, multi-language, and intelligent social publishing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-navy-950 text-txt-primary min-h-screen relative font-sans antialiased overflow-x-hidden">
        {/* Apply the saved theme before first paint to avoid a flash
            of the default palette. Mirrors getStoredTheme(). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("smp_theme_preference");if(t==="emerald"||t==="ocean"||t==="violet"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
        {/* Apply the saved language + direction before first paint, so
            a refresh never starts LTR and flips to RTL while the saved
            locale's dictionary loads. Mirrors getStoredLocale(). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("smp_locale_preference");if(l==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl"}else if(l==="tr"||l==="en"){document.documentElement.lang=l;document.documentElement.dir="ltr"}}catch(e){}`,
          }}
        />
        {/* Ambient background light gradients for authentic Liquid Glass depth */}
        <div className="fixed top-0 -start-40 w-96 h-96 rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none -z-10" />
        <div className="fixed top-1/3 -end-40 w-96 h-96 rounded-full bg-accent-cyan/10 blur-[130px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 start-1/3 w-96 h-96 rounded-full bg-accent-indigo/10 blur-[140px] pointer-events-none -z-10" />

        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
