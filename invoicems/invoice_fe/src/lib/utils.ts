import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A simple implementation for converting numbers to words.
// For a full-featured version, especially for Indian numbering, a more robust library might be needed.
export function amountToWords(amount: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const numToWords = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 !== 0 ? ' ' + numToWords(n % 100000) : '');
    return 'Number too large';
  };

  if (amount === 0) return 'zero';

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = numToWords(rupees) + ' rupees';
  if (paise > 0) {
    words += ' and ' + numToWords(paise) + ' paise';
  }

  return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
