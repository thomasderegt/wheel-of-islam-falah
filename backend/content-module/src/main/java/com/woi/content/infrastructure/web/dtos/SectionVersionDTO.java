package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for SectionVersion response
 */
public class SectionVersionDTO {
    private Long id;
    private Long sectionId;
    private Integer versionNumber;
    private String titleEn;
    private String titleNl;
    private String introEn;
    private String introNl;
    private Long createdBy;
    private LocalDateTime createdAt;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSectionId() {
        return sectionId;
    }
    
    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }
    
    public Integer getVersionNumber() {
        return versionNumber;
    }
    
    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }
    
    public String getTitleEn() {
        return titleEn;
    }
    
    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }
    
    public String getTitleNl() {
        return titleNl;
    }
    
    public void setTitleNl(String titleNl) {
        this.titleNl = titleNl;
    }
    
    public String getIntroEn() {
        return introEn;
    }
    
    public void setIntroEn(String introEn) {
        this.introEn = introEn;
    }
    
    public String getIntroNl() {
        return introNl;
    }
    
    public void setIntroNl(String introNl) {
        this.introNl = introNl;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

