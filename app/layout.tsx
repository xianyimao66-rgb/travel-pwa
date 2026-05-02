import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "旅行规划 - AI 行程助手",
  description: "用 AI 轻松规划你的完美旅程",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "旅行规划",
  },
  icons: {
    apple: "/icons/icon-192x192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 to-white antialiased">
        {children}
      </body>
    </html>
  );
}
