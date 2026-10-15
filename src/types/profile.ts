export interface Profile {
  id: string
  firstName: string
  /** Empty for accounts created before last names were collected. */
  lastName: string
  /** Where the person lives; empty if they have not said. */
  city: string
}

/** What the sign-up form collects. */
export interface NewProfileInput {
  firstName: string
  lastName: string
  city: string
}

export type ProfileUpdate = Partial<Omit<Profile, 'id'>>
