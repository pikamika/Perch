export const AVATAR_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'] as const
export type AvatarColor = (typeof AVATAR_COLORS)[number]

export interface Profile {
  id: string
  firstName: string
  /** Where the person lives; empty if they have not said. */
  city: string
  /** Any single emoji. */
  avatarEmoji: string
  avatarColor: AvatarColor
}

/** What the sign-up form collects (the avatar is picked automatically). */
export interface NewProfileInput {
  firstName: string
  city: string
  avatarEmoji: string
  avatarColor: AvatarColor
}

export type ProfileUpdate = Partial<Omit<Profile, 'id'>>
