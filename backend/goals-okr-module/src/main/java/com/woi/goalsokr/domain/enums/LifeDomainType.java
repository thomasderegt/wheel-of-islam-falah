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
    
    // Work/Professional Development Domains
    CAREER_GROWTH,
    SKILLS_DEVELOPMENT,
    COMMUNICATION,
    LEADERSHIP,
    NETWORKING,
    PERFORMANCE,
    REPUTATION,
    TIME_MANAGEMENT,
    WORK_LIFE_BALANCE,
    PROJECT,  // Project management and execution in work context
    
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
