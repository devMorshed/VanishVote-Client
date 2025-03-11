import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeLeft(expiresAt: Date) {
  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()

  if (diffMs <= 0) {
    return "Expired"
  }

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

  if (diffHrs > 0) {
    return `${diffHrs}h ${diffMins}m left`
  }

  return `${diffMins}m ${diffSecs}s left`
}
