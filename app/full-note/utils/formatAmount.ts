const amountFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 20,
});

export function formatAmount(amount: number): string {
  return amountFormatter.format(amount);
}

