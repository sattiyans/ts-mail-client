import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <Link href="/" className="text-white text-lg font-semibold">
          TS Mail Client
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-gray-500 text-sm">
        <p>&copy; 2024 TS Mail Client. All rights reserved.</p>
      </footer>
    </div>
  );
}
