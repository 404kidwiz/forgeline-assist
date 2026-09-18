import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { UserSwitcher } from "@/components/UserSwitcher";

export const metadata: Metadata = { title: "ForgeLine Assist — fictional demo", description: "Plant supervisor workspace demo. Fictional data, not for operational use." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">ForgeLine Assist <span className="badge">Fictional demo</span></div>
            <Nav />
            <div style={{ padding: "0 12px 8px" }}>
              <a href="/__deck" target="_blank" rel="noopener" className="badge" style={{ textDecoration: "none", color: "var(--accent)", background: "var(--accent-soft)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", padding: "4px 8px", borderRadius: 6, fontWeight: 500 }}>
                📊 Pitch deck &rarr;
              </a>
            </div>
            <div className="sidebar-footer"><UserSwitcher /></div>
          </aside>
          <main id="main" className="main">{children}</main>
        </div>
        <Nav mobile />
      </body>
    </html>
  );
}
