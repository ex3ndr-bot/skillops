import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, IBM_Plex_Sans } from "next/font/google";

import { ThemeToggle } from "@/components/ThemeToggle";

import "./globals.css";

const headingFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SkillOps",
  description: "Enterprise AI skills management platform",
};

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/registry", label: "Registry" },
  { href: "/security", label: "Security" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="dark" lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <div className="shell">
          <aside className="sidebar">
            <Link className="brand" href="/">
              <span className="brand-mark">SO</span>
              <div>
                <strong>SkillOps</strong>
                <p>Enterprise AI registry</p>
              </div>
            </Link>
            <nav className="nav">
              {navigation.map((item) => (
                <Link className="nav-link" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="sidebar-footer">
              <div>
                <p className="eyebrow">Workspace</p>
                <strong>North America Production</strong>
              </div>
              <ThemeToggle />
            </div>
          </aside>
          <main className="content">
            <header className="topbar">
              <div>
                <p className="eyebrow">Control plane</p>
                <h1>Manage AI skills with security-first governance</h1>
              </div>
              <div className="topbar-actions">
                <button className="button button-secondary" type="button">
                  Export report
                </button>
                <button className="button" type="button">
                  Add skill
                </button>
              </div>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
