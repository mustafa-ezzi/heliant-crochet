export function formatMoney(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "PKR 0";
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `PKR ${formatted}`;
}
