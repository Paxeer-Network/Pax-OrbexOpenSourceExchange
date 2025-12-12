"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPercentage = exports.formatFiatBalance = exports.formatCryptoBalance = exports.formatBalance = void 0;
/**
 * Formats a number with thousand separators and specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 3)
 * @param currency - Currency symbol to prepend (optional)
 * @returns Formatted string with thousand separators
 */
function formatBalance(value, decimals = 3, currency) {
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
exports.formatBalance = formatBalance;
/**
 * Formats a balance for cryptocurrency display
 * @param value - The balance value
 * @param currency - The currency code
 * @param decimals - Number of decimal places (default: 6 for crypto)
 * @returns Formatted balance string
 */
function formatCryptoBalance(value, currency, decimals = 6) {
    return formatBalance(value, decimals, currency);
}
exports.formatCryptoBalance = formatCryptoBalance;
/**
 * Formats a balance for fiat currency display
 * @param value - The balance value
 * @param currency - The currency code (default: USD)
 * @param decimals - Number of decimal places (default: 2 for fiat)
 * @returns Formatted balance string
 */
function formatFiatBalance(value, currency = 'USD', decimals = 2) {
    return formatBalance(value, decimals, currency);
}
exports.formatFiatBalance = formatFiatBalance;
/**
 * Formats a percentage with proper decimal places
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
function formatPercentage(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return `0.${'0'.repeat(decimals)}%`;
    }
    const num = Number(value);
    return `${num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}%`;
}
exports.formatPercentage = formatPercentage;
