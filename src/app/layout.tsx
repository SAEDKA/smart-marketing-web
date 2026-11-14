import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";

export const metadata: Metadata = {
  title: "Smart Marketing | AI-Powered Social Media Marketing Platform",
  description:
    "Enterprise-grade AI marketing workspace for growing businesses. Liquid Glass design, multi-language, and intelligent social publishing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="bg-navy-950 text-white min-h-screen relative font-sans antialiased overflow-x-hidden">
        {/* Ambient background light gradients for authentic Liquid Glass depth */}
        <div className="fixed top-0 -start-40 w-96 h-96 rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none -z-10" />
        <div className="fixed top-1/3 -end-40 w-96 h-96 rounded-full bg-accent-cyan/10 blur-[130px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 start-1/3 w-96 h-96 rounded-full bg-accent-indigo/10 blur-[140px] pointer-events-none -z-10" />

        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
