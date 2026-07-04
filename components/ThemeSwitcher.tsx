"use client"

import React from "react"
import { useTheme, Theme } from "./ThemeProvider"

const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "theme-latte", label: "Catppuccin Latte" },
  { value: "theme-frappe", label: "Catppuccin Frappé" },
  { value: "theme-macchiato", label: "Catppuccin Macchiato" },
  { value: "theme-mocha", label: "Catppuccin Mocha" },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 bg-muted/60 hover:bg-muted/80 border border-border px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-muted-foreground"
      >
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34343 19.4849 5.34343 20.2694 4.85857 20.7543C4.66442 20.9484 4.3986 21.0427 4.13626 20.9996C3.76569 20.9388 3.5 20.6125 3.5 20.2359V19C3.5 17.3431 4.84315 16 6.5 16H8C8.82843 16 9.5 15.3284 9.5 14.5V13C9.5 12.1716 10.1716 11.5 11 11.5H12.5C13.3284 11.5 14 10.8284 14 10V8.5C14 7.67157 14.6716 7 15.5 7H17C17.8284 7 18.5 6.32843 18.5 5.5C18.5 5.09311 18.2982 4.73305 17.9904 4.51658C17.6972 4.31034 17.6203 3.91039 17.8265 3.61722C18.0328 3.32405 18.4327 3.2471 18.7259 3.45334C19.5312 4.01918 20.0601 4.96024 20.0135 6.00977C19.9234 8.03816 18.2575 9.70408 16.2291 9.7942C15.9189 9.808 15.5 10.126 15.5 10.5V11C15.5 12.3807 14.3807 13.5 13 13.5H11.5C10.9477 13.5 10.5 13.9477 10.5 14.5V15.5C10.5 16.8807 9.38071 18 8 18H6.5C5.67157 18 5 18.6716 5 19.5V20.1259C5 21.1611 5.8389 22 6.8741 22H12Z" />
        <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
        <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
        <circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
        <circle cx="15.5" cy="14.5" r="1" fill="currentColor" />
      </svg>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="bg-transparent text-foreground border-none font-semibold focus:outline-none cursor-pointer pr-1 font-sans"
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value} className="bg-card text-foreground font-semibold">
            {t.label}
          </option>
        ))}
      </select>
    </div>
  )
}
