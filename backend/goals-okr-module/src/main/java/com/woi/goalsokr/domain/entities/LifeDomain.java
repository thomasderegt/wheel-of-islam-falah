package com.woi.goalsokr.domain.entities;

import com.woi.goalsokr.domain.enums.LifeDomainType;
import java.time.LocalDateTime;

/**
 * LifeDomain domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a life domain for OKR goals (e.g., Religion, Family, Work)
 * Points to goals_okr.life_domains
 * 
 * Business logic:
 * - Title fallback logic (als titleNl null is, gebruik titleEn en vice versa)
 * - Ten minste één title moet aanwezig zijn
 * - domainKey must match LifeDomainType enum
 */
public class LifeDomain {
    private Long id;
    private LifeDomainType domainKey;
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    private String iconName;
    private Integer displayOrder;
    private Long wheelId; // FK to Wheel
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public LifeDomain() {}
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LifeDomainType getDomainKey() {
        return domainKey;
    }
    
    public void setDomainKey(LifeDomainType domainKey) {
        this.domainKey = domainKey;
    }
    
    public String getTitleNl() {
        return titleNl;
    }
    
    public void setTitleNl(String titleNl) {
        this.titleNl = titleNl;
    }
    
    public String getTitleEn() {
        return titleEn;
    }
    
    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }
    
    /**
     * Get title with fallback logic
     * Returns titleNl if available, otherwise titleEn
     */
    public String getTitle(String language) {
        if ("nl".equals(language)) {
            return titleNl != null ? titleNl : titleEn;
        }
        return titleEn != null ? titleEn : titleNl;
    }
    
    public String getDescriptionNl() {
        return descriptionNl;
    }
    
    public void setDescriptionNl(String descriptionNl) {
        this.descriptionNl = descriptionNl;
    }
    
    public String getDescriptionEn() {
        return descriptionEn;
    }
    
    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }
    
    public String getIconName() {
        return iconName;
    }
    
    public void setIconName(String iconName) {
        this.iconName = iconName;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public Long getWheelId() {
        return wheelId;
    }
    
    public void setWheelId(Long wheelId) {
        this.wheelId = wheelId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
