"use client";

import { useEffect, useState } from "react";

const storageKey = "skillops-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(storageKey) as "light" | "dark" | null)
        : null;
    const nextTheme =
      storedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} type="button">
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
