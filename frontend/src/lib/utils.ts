import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Get week start (Monday) in user's timezone
 */
export function getWeekStart(date: Date = new Date(), timezone?: string): Date {
  const d = new Date(date)
  
  // Convert to user's timezone if provided
  if (timezone) {
    const localDate = new Date(d.toLocaleString('en-US', { timeZone: timezone }))
    d.setTime(localDate.getTime())
  }
  
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as start
  const weekStart = new Date(d.setDate(diff))
  weekStart.setHours(0, 0, 0, 0) // Start of day
  return weekStart
}

/**
 * Get week end (Sunday) in user's timezone
 */
export function getWeekEnd(date: Date = new Date(), timezone?: string): Date {
  const weekStart = getWeekStart(date, timezone)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999) // End of day
  return weekEnd
}

export function isSameWeek(date1: Date, date2: Date, timezone?: string): boolean {
  const week1Start = getWeekStart(date1, timezone)
  const week2Start = getWeekStart(date2, timezone)
  return week1Start.getTime() === week2Start.getTime()
}

/**
 * Get user's timezone (browser default or from preferences)
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format date in user's timezone
 */
export function formatDateInTimezone(date: Date | string, timezone?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const tz = timezone || getUserTimezone()
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  })
}



