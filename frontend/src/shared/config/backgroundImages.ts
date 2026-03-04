/**
 * Background images available in public/BackgroundPictures/
 * Add new filenames here when adding images to the folder.
 */
export const BACKGROUND_IMAGES = [
  'BackgroundAdult.png',
  'Ahmet-Kagan-Hancer.jpg',
  'Chris-Boland.jpg',
  'GR-stocks.jpg',
  'Hasan-Almasi.jpg',
  'Ines-Sayadi.jpg',
  'Kareem-Saleh-2.jpg',
  'Kareem-Saleh2.jpg',
  'Kareem-Saleh3.jpg',
  'Klaus-Kreuer.jpg',
  'Masjid-Pogung-Dalangan.jpg',
  'Masjid-Pogung-Dalangan2.jpg',
  'Mhrezaa.jpg',
  'Pommelien-Da-Silva.jpg',
  'Ramy-Kabalan.jpg',
  'Saj-Shafique.jpg',
  'Yasmine-Arfaouij.jpg',
] as const

export type BackgroundImageFilename = (typeof BACKGROUND_IMAGES)[number]

export const getBackgroundImagePath = (filename: string): string =>
  `/BackgroundPictures/${filename}`
