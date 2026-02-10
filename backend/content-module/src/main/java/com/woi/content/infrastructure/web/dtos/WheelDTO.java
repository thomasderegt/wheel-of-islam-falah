package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Wheel response
 */
public class WheelDTO {
    private Long id;
    private String wheelKey;
    private String nameNl;
    private String nameEn;
    private String descriptionNl;
    private String descriptionEn;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    
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
