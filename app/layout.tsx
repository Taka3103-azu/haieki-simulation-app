import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "廃液売買シミュレーター",
  description: "有機・無機廃液の売却価値と購入メリットを試算",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="ja">
      <body>
        {/* 
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
 */}
        {/* ページごとの内容 */}
        <main style={{ padding: 20 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
