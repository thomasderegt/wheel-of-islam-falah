package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Category response
 */
public class CategoryDTO {
    private Long id;
    private Integer categoryNumber;
    private Long wheelId; // FK to content.wheels
    private String titleNl;
    private String titleEn;
    private String subtitleNl;
    private String subtitleEn;
    private String descriptionNl;
    private String descriptionEn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getCategoryNumber() {
        return categoryNumber;
    }
    
    public void setCategoryNumber(Integer categoryNumber) {
        this.categoryNumber = categoryNumber;
    }
    
    public Long getWheelId() {
        return wheelId;
    }
    
    public void setWheelId(Long wheelId) {
        this.wheelId = wheelId;
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
    
    public String getSubtitleNl() {
        return subtitleNl;
    }
    
    public void setSubtitleNl(String subtitleNl) {
        this.subtitleNl = subtitleNl;
    }
    
    public String getSubtitleEn() {
        return subtitleEn;
    }
    
    public void setSubtitleEn(String subtitleEn) {
        this.subtitleEn = subtitleEn;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

