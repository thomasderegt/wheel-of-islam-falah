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
     * @return New Goal instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static Goal create(Long lifeDomainId, String titleNl, String titleEn, Integer orderIndex) {
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

        Goal goal = new Goal();
        goal.lifeDomainId = lifeDomainId;
        goal.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        goal.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        goal.orderIndex = orderIndex;
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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
