"use client"

import * as React from "react"
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes"

import ThemeToggle from "./theme-toggle"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <main className="bg-[#efefef] dark:bg-[#090909]">{children}</main>
      <ThemeToggle />
    </NextThemesProvider>
  )
}
