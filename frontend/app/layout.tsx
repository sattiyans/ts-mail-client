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
    <html lang="en">
      <head>
        {/* Apply saved theme ASAP (before hydration) to prevent flash + mismatch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var s=localStorage.getItem('theme'),p=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,d=s?s==='dark':p;var e=document.documentElement.classList;e.toggle('dark',d)}catch(e){}}();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}