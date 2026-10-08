export function formatSpend(amount: number): string {
  return `$${amount}`
}

export function formatPerPerson(amount: number): string {
  return `~${formatSpend(amount)} / person`
}
