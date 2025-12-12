/**
 * Formats a number with thousand separators and specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 3)
 * @param currency - Currency symbol to prepend (optional)
 * @returns Formatted string with thousand separators
 */
export function formatBalance(
  value: number | string | null | undefined,
  decimals: number = 3,
  currency?: string
): string {
  // Handle null, undefined, or invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    const formatted = `0.${'0'.repeat(decimals)}`;
    return currency ? `${currency} ${formatted}` : formatted;
  }

  const num = Number(value);
  
  // Format with specified decimal places
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return currency ? `${currency} ${formatted}` : formatted;
}

/**
 * Formats a balance for cryptocurrency display
 * @param value - The balance value
 * @param currency - The currency code
 * @param decimals - Number of decimal places (default: 6 for crypto)
 * @returns Formatted balance string
 */
export function formatCryptoBalance(
  value: number | string | null | undefined,
  currency: string,
  decimals: number = 6
): string {
  return formatBalance(value, decimals, currency);
}

/**
 * Formats a balance for fiat currency display
 * @param value - The balance value
 * @param currency - The currency code (default: USD)
 * @param decimals - Number of decimal places (default: 2 for fiat)
 * @returns Formatted balance string
 */
export function formatFiatBalance(
  value: number | string | null | undefined,
  currency: string = 'USD',
  decimals: number = 2
): string {
  return formatBalance(value, decimals, currency);
}

/**
 * Formats a percentage with proper decimal places
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return `0.${'0'.repeat(decimals)}%`;
  }

  const num = Number(value);
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}
