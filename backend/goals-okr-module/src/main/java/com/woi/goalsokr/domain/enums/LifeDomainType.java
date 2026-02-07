package com.woi.goalsokr.domain.enums;

/**
 * Life domain type enum
 * 
 * Represents the different life domains for 360° goals assessment
 * Includes both personal life domains (Wheel of Life) and business domains (Wheel of Business)
 */
public enum LifeDomainType {
    // Personal Life Domains (Wheel of Life)
    RELIGION,
    FAMILY,
    WORK,
    HEALTH,
    FINANCE,
    EDUCATION,
    SOCIAL,
    PERSONAL_GROWTH,
    SPORTS,
    REST,
    
    // Business Domains (Wheel of Business)
    SHARIAH,  // Shariah compliance (centraal)
    PRODUCT,
    SALES,
    MARKETING,
    LEAN,
    BUSINESS_FINANCE,  // Business finance (separate from personal FINANCE)
    CUSTOMER_SUCCESS,
    TEAM,
    TECHNOLOGY,
    INNOVATION
}
