// Type definitions for theme system

// Type for user groups
export type UserGroup = 
  | 'adult-woman' 
  | 'adult-man' 
  | 'young-adult-male'
  | 'young-adult-female'
  | 'premium'
  | 'universal'
  | null

// Type for the Theme Context
export interface ThemeContextType {
  userGroup: UserGroup
  setUserGroup: (group: string) => void
  availableGroups: string[]
  backgroundImage: string | null
  setBackgroundImage: (image: string | null) => void
  availableBackgrounds: readonly string[]
}
