package com.woi.content.infrastructure.web.dtos;

/**
 * DTO for updating a category
 */
public class UpdateCategoryRequestDTO {
    
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    
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
}

