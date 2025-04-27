export function formatCurrency(value, currency = 'COP', locale = 'es-CO') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function formatDate(dateString) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}