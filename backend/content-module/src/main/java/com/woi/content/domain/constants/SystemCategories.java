package com.woi.content.domain.constants;

/**
 * System Categories - Hardcoded categories that are required for the application
 * These categories are seeded on database initialization and cannot be deleted
 */
public class SystemCategories {
    
    /**
     * Category number for "Falah" (central category)
     */
    public static final int FALAH_NUMBER = 0;
    
    /**
     * Category number for "Build Your Dunya"
     */
    public static final int BUILD_YOUR_DUNYA_NUMBER = 1;
    
    /**
     * Category number for "Strengthen Your Inner World"
     */
    public static final int STRENGTHEN_INNER_WORLD_NUMBER = 2;
    
    /**
     * Category number for "Prepare for the Ākhirah"
     */
    public static final int PREPARE_FOR_AKHIRAH_NUMBER = 3;
    
    /**
     * Category number for "Fiqh, Divine do's and donts"
     */
    public static final int FIQH_NUMBER = 4;
    
    /**
     * Check if a category number is a system category
     * 
     * @param categoryNumber Category number to check
     * @return true if it's a system category, false otherwise
     */
    public static boolean isSystemCategory(Integer categoryNumber) {
        if (categoryNumber == null) {
            return false;
        }
        return categoryNumber == FALAH_NUMBER ||
               categoryNumber == BUILD_YOUR_DUNYA_NUMBER ||
               categoryNumber == STRENGTHEN_INNER_WORLD_NUMBER ||
               categoryNumber == PREPARE_FOR_AKHIRAH_NUMBER ||
               categoryNumber == FIQH_NUMBER;
    }
    
    /**
     * Get all system category numbers
     * 
     * @return Array of system category numbers
     */
    public static int[] getAllSystemCategoryNumbers() {
        return new int[]{
            FALAH_NUMBER,
            BUILD_YOUR_DUNYA_NUMBER,
            STRENGTHEN_INNER_WORLD_NUMBER,
            PREPARE_FOR_AKHIRAH_NUMBER,
            FIQH_NUMBER
        };
    }
}

