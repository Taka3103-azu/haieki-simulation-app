import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Time App",
  description: "Display current time",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="ja">
      <body>
        {/* メニューバー */}
        <nav style={{
          padding: "12px 20px",
          background: "#f0f0f0",
          borderBottom: "1px solid #ccc"
        }}>
          <Link href="/time" style={{ marginRight: 20 }}>時刻</Link>
          <Link href="/about" style={{ marginRight: 20 }}>About</Link>
          <Link href="/contact" style={{ marginRight: 20 }}>Contact</Link>
          <Link href="/profile">Profile</Link>
        </nav>

        {/* ページごとの内容 */}
        <main style={{ padding: 20 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
