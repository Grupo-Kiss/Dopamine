export type CreditRecord = {
  readonly id: string
  readonly kind: string
  readonly title: string
  readonly creatorLabel: string
  readonly license: string
  readonly attribution: string
  readonly sourceUrl?: string
  readonly provider?: string
  readonly usedInMatch?: boolean
}

export type CreditsStore = {
  readonly game: {
    readonly title: string
    readonly blurb: string
    readonly authors: readonly string[]
  }
  readonly disclaimer: string
  readonly providersNotice: string
  readonly records: readonly CreditRecord[]
}
