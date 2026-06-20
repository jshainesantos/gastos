import { format, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatMonthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return format(new Date(Number(year), Number(month) - 1, 1), 'MMMM yyyy')
}

export function getCurrentYearMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7)
}
