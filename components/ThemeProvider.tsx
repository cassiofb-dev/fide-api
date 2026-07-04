"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "theme-latte" | "theme-frappe" | "theme-macchiato" | "theme-mocha"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_CLASSES: Theme[] = [
  "light",
  "dark",
  "theme-latte",
  "theme-frappe",
  "theme-macchiato",
  "theme-mocha",
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark") // Default to dark

  useEffect(() => {
    // Read theme from localStorage or document class
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && THEME_CLASSES.includes(savedTheme)) {
      setThemeState(savedTheme)
    } else {
      // Check if document already has a theme class applied by the head script
      const classList = document.documentElement.classList
      const currentTheme = THEME_CLASSES.find((t) => classList.contains(t))
      if (currentTheme) {
        setThemeState(currentTheme)
      }
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    if (!THEME_CLASSES.includes(newTheme)) return

    const root = document.documentElement
    // Remove all existing themes
    THEME_CLASSES.forEach((t) => {
      root.classList.remove(t)
    })

    // Add selected theme
    root.classList.add(newTheme)
    
    // Save to localStorage
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
