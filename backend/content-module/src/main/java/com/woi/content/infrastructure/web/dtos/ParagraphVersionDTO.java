package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for ParagraphVersion response
 */
public class ParagraphVersionDTO {
    private Long id;
    private Long paragraphId;
    private Integer versionNumber;
    private String titleEn;
    private String titleNl;
    private String contentEn;
    private String contentNl;
    private Long createdBy;
    private LocalDateTime createdAt;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getParagraphId() {
        return paragraphId;
    }
    
    public void setParagraphId(Long paragraphId) {
        this.paragraphId = paragraphId;
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
    
    public String getContentEn() {
        return contentEn;
    }
    
    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }
    
    public String getContentNl() {
        return contentNl;
    }
    
    public void setContentNl(String contentNl) {
        this.contentNl = contentNl;
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

