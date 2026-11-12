import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ThemeScript } from "@/components/common/ThemeScript";
import { getAllExtraSearchDocuments } from "@/lib/search/documents";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Python Learning — From Basics to Operators",
    template: "%s | Python Learning",
  },
  description:
    "Master Python fundamentals through structured chapters, real in-browser Python execution, practice quizzes, and guided AI explanations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const extraSearchDocs = getAllExtraSearchDocuments();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink transition-colors duration-150">
        <ThemeScript />
        <AppProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to main content
          </a>
          <AppHeader searchDocuments={extraSearchDocs} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <AppFooter />
        </AppProviders>
      </body>
    </html>
  );
}
