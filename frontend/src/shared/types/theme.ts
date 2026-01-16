// Type definitions for theme system

// Type for user groups
export type UserGroup = 
  | 'adult-woman' 
  | 'adult-man' 
  | 'young-adult-male'
  | 'young-adult-female'
  | 'universal' 
  | null

// Type for background images
export type BackgroundImage = 
  | 'BackgroundYoungAdult.png'
  | 'BackgroundYoungAdultMan.png'
  | 'BackgroundYoungAdultWoman.png'
  | 'BackgroundAdult.png'
  | 'BackgroundAdultWoman.png'
  | 'picture1.png'
  | 'picture2.png'
  | 'picture3.png'
  | 'picture4.png'
  | 'picture5.png'
  | 'picture6.png'
  | 'picture7.png'
  | 'picture8.png'
  | 'picture9.png'
  | 'picture10.png'
  | 'picture11.png'
  | 'picture12.png'
  | 'picture13.png'
  | 'picture14.png'
  | 'picture15.png'
  | 'picture16.png'

// Type for the Theme Context
export interface ThemeContextType {
  userGroup: UserGroup
  setUserGroup: (group: string) => void
  availableGroups: string[]
  backgroundImage: BackgroundImage | null
  setBackgroundImage: (image: BackgroundImage) => void
  availableBackgrounds: BackgroundImage[]
}
