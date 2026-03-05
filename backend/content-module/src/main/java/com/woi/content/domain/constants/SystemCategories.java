package com.woi.content.domain.constants;

/**
 * System Categories - Hardcoded categories that are required for the application
 * Structure: 0=Falah (center), 1=Aqeedah, 2=Tazkiyyah, 3=Fiqh
 */
public class SystemCategories {
    
    public static final int FALAH_NUMBER = 0;
    public static final int AQEEDAH_NUMBER = 1;
    public static final int TAZKIYYAH_NUMBER = 2;
    public static final int FIQH_NUMBER = 3;
    
    /**
     * Check if a category number is a system category
     */
    public static boolean isSystemCategory(Integer categoryNumber) {
        if (categoryNumber == null) {
            return false;
        }
        return categoryNumber == FALAH_NUMBER ||
               categoryNumber == AQEEDAH_NUMBER ||
               categoryNumber == TAZKIYYAH_NUMBER ||
               categoryNumber == FIQH_NUMBER;
    }
    
    /**
     * Get all system category numbers (Wheel of Islam: Falah, Aqeedah, Tazkiyyah, Fiqh)
     */
    public static int[] getAllSystemCategoryNumbers() {
        return new int[]{ FALAH_NUMBER, AQEEDAH_NUMBER, TAZKIYYAH_NUMBER, FIQH_NUMBER };
    }
}
