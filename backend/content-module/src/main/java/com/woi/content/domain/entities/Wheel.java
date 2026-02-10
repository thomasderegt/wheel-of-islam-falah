package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Wheel domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a wheel for organizing categories (e.g., Wheel of Islam)
 * Points to content.wheels
 * 
 * Business logic:
 * - Title fallback logic (als nameNl null is, gebruik nameEn en vice versa)
 * - Ten minste één name moet aanwezig zijn
 */
public class Wheel {
    private Long id;
    private String wheelKey; // 'WHEEL_OF_ISLAM'
    private String nameNl;
    private String nameEn;
    private String descriptionNl;
    private String descriptionEn;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Wheel() {}
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getWheelKey() {
        return wheelKey;
    }
    
    public void setWheelKey(String wheelKey) {
        this.wheelKey = wheelKey;
    }
    
    public String getNameNl() {
        return nameNl;
    }
    
    public void setNameNl(String nameNl) {
        this.nameNl = nameNl;
    }
    
    public String getNameEn() {
        return nameEn;
    }
    
    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }
    
    /**
     * Get name with fallback logic
     * Returns nameNl if available, otherwise nameEn
     */
    public String getName(String language) {
        if ("nl".equals(language)) {
            return nameNl != null ? nameNl : nameEn;
        }
        return nameEn != null ? nameEn : nameNl;
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
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
