"use client"

interface PriceDisplayProps {
  amount: number
  className?: string
  currency?: string
  locale?: string
}

export function PriceDisplay({
  amount,
  className = "",
  currency = "USD",
  locale = "en-US",
}: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)

  return <span className={className}>{formatted}</span>
}
