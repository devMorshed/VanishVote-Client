"use client"

import { useCallback } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const handleToggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark")
  }, [isDark, setTheme])

  return (
    <div className="absolute top-5 right-5">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Toggle theme"
        aria-pressed={isDark}
        className="
        group relative inline-flex items-center gap-2 overflow-hidden 
        rounded-md border border-neutral-500/10 bg-white px-2 py-1 
        font-medium text-neutral-600 tracking-tight transition-all 
        hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 
        dark:hover:bg-neutral-700
      "
      >
        {/* Animated Sun/Moon Icon */}
        <span
          className={cn(
            "relative size-6 scale-75 rounded-full bg-gradient-to-tr"
          )}
        >
          <span
            className={cn(
              "absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-gradient-to-tr from-indigo-400 to-sky-200 transition-all duration-500",
              isDark ? "scale-100" : "scale-90"
            )}
          />
          <span
            className={cn(
              "absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 transition-all duration-500 dark:from-rose-600 dark:to-amber-600",
              isDark ? "opacity-0" : "opacity-100"
            )}
          />
          <span
            className={cn(
              "absolute top-0 right-0 z-20 size-4 origin-top-right transform-gpu rounded-full bg-white transition-transform duration-500 group-hover:bg-neutral-100 dark:bg-neutral-800 group-hover:dark:bg-neutral-700",
              isDark ? "scale-100" : "scale-0"
            )}
          />
        </span>

        {/* Theme Text Toggle */}
        <span className="relative h-6 w-12">
          <span
            className={cn(
              "absolute top-0 left-0 transition-all duration-1000",
              isDark
                ? "-translate-y-4 opacity-0 blur-lg"
                : "translate-y-0 opacity-100 blur-0"
            )}
          >
            Light
          </span>
          <span
            className={cn(
              "absolute top-0 left-0 transition-all duration-1000",
              isDark
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-4 opacity-0 blur-lg"
            )}
          >
            Dark
          </span>
        </span>
      </button>
    </div>
  )
}

export default ThemeToggle
