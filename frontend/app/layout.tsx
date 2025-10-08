import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TS Mail Client",
  description: "A minimal, modern email client web app with domain management, email templates, bulk sending, and analytics - Git connected!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Apply saved theme before hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const saved = localStorage.getItem('theme'); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; const isDark = saved ? saved === 'dark' : prefersDark; document.documentElement.classList.toggle('dark', isDark); } catch (_) {} })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}