export function formatSpend(amount: number): string {
  return `$${amount}`
}

/** What a typical drink plus a snack costs. */
export function formatTypicalSpend(amount: number): string {
  return `~${formatSpend(amount)} drink + snack`
}
