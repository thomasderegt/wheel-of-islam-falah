/**
 * System Categories Constants
 * Hardcoded category numbers for the main categories used on the home page
 */

export const SYSTEM_CATEGORIES = {
  FALAH: {
    categoryNumber: 0,
    titleEn: 'Falah',
    titleNl: 'Falah',
    slug: 'falah',
  },
  BUILD_YOUR_DUNYA: {
    categoryNumber: 1,
    titleEn: 'Build Your Dunya',
    titleNl: 'Bouw Je Dunya',
    slug: 'build-your-dunya',
  },
  STRENGTHEN_INNER_WORLD: {
    categoryNumber: 2,
    titleEn: 'Strengthen Your Inner World',
    titleNl: 'Versterk Je Innerlijke Wereld',
    slug: 'strengthen-your-inner-world',
  },
  PREPARE_FOR_AKHIRAH: {
    categoryNumber: 3,
    titleEn: 'Prepare for the Ākhirah',
    titleNl: 'Bereid Je Voor op de Ākhirah',
    slug: 'prepare-for-the-akhirah',
  },
} as const;

export function isSystemCategory(categoryNumber: number | null | undefined): boolean {
  if (categoryNumber == null) return false;
  return Object.values(SYSTEM_CATEGORIES).some(cat => cat.categoryNumber === categoryNumber);
}

