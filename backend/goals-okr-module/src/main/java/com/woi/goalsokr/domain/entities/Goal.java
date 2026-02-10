package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * Goal domain entity - Pure POJO (no JPA annotations)
 *
 * Represents an inspiring, qualitative goal on a high level within a life domain (template).
 * Part of OKR structure: Life Domain → Goal → Objective → Key Result → Initiative
 *
 * Business rules:
 * - lifeDomainId is required
 * - titleNl/En are required (with fallback logic)
 * - orderIndex is required and unique within a life domain
 */
public class Goal {
    private Long id;
    private Long lifeDomainId; // Required - FK to LifeDomain
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    private Integer orderIndex; // Order within the life domain
    private Integer quarter; // Program Increment quarter (1-4)
    private Integer year; // Program Increment year (e.g., 2025)
    private String number; // Unique human-readable number (e.g., "GOAL-123")
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Public constructor for mappers (infrastructure layer)
    public Goal() {}

    /**
     * Factory method: Create a new goal
     *
     * @param lifeDomainId Life Domain ID (required)
     * @param titleNl Dutch title (can be null)
     * @param titleEn English title (can be null)
     * @param orderIndex Order index within the life domain (required)
     * @param quarter Program Increment quarter (1-4, optional)
     * @param year Program Increment year (e.g., 2025, optional)
     * @return New Goal instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static Goal create(Long lifeDomainId, String titleNl, String titleEn, Integer orderIndex, Integer quarter, Integer year) {
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
        }
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        if (orderIndex == null || orderIndex < 1) {
            throw new IllegalArgumentException("Order index must be a positive integer");
        }
        if (quarter != null && (quarter < 1 || quarter > 4)) {
            throw new IllegalArgumentException("Quarter must be between 1 and 4");
        }
        if (year != null && year < 2000) {
            throw new IllegalArgumentException("Year must be 2000 or later");
        }

        Goal goal = new Goal();
        goal.lifeDomainId = lifeDomainId;
        goal.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        goal.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        goal.orderIndex = orderIndex;
        goal.quarter = quarter;
        goal.year = year;
        goal.createdAt = LocalDateTime.now();
        goal.updatedAt = LocalDateTime.now();
        return goal;
    }

    /**
     * Get title with fallback logic
     */
    public String getTitle(String language) {
        if ("nl".equals(language)) {
            return titleNl != null ? titleNl : titleEn;
        }
        return titleEn != null ? titleEn : titleNl;
    }

    // Getters
    public Long getId() { return id; }
    public Long getLifeDomainId() { return lifeDomainId; }
    public String getTitleNl() { return titleNl; }
    public String getTitleEn() { return titleEn; }
    public String getDescriptionNl() { return descriptionNl; }
    public String getDescriptionEn() { return descriptionEn; }
    public Integer getOrderIndex() { return orderIndex; }
    public Integer getQuarter() { return quarter; }
    public Integer getYear() { return year; }
    public String getNumber() { return number; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setLifeDomainId(Long lifeDomainId) { this.lifeDomainId = lifeDomainId; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setQuarter(Integer quarter) { this.quarter = quarter; }
    public void setYear(Integer year) { this.year = year; }
    public void setNumber(String number) { this.number = number; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
