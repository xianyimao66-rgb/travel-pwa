import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import FeedbackBox from "@/components/FeedbackBox";

export const metadata: Metadata = {
  title: "Travel Planner China — AI-Powered Itineraries",
  description:
    "Discover China's best destinations. AI creates your perfect travel itinerary.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Travel Planner",
  },
  viewport:
    "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <Script
        id="register-sw"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(reg => {
                  console.log('SW registered:', reg.scope);
                }).catch(err => {
                  console.log('SW registration failed:', err);
                });
              });
            }
          `,
        }}
      />
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Travel
              </span>
              Planner
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/destinations"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Destinations
              </Link>
              <Link
                href="/trip-planner"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Plan Trip
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Global Feedback Box */}
        <FeedbackBox />

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center sm:px-6">
            <p className="text-sm text-gray-400">Travel Planner · AI-powered trip planning for China</p>
            <p className="mt-2 text-xs text-gray-300">
              Some links on this site are affiliate links.{" "}
              <a
                href="https://t.ctrip.cn/rDS67sX"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="underline hover:text-gray-400 transition-colors"
              >
                Book via Ctrip
              </a>
              {" "}to support us at no extra cost to you.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
