export interface Profile {
  id: string
  firstName: string
  /** Where the person lives; empty if they have not said. */
  city: string
}

/** What the sign-up form collects. */
export interface NewProfileInput {
  firstName: string
  city: string
}

export type ProfileUpdate = Partial<Omit<Profile, 'id'>>
