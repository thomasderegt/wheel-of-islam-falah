package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Paragraph response
 */
public class ParagraphDTO {
    private Long id;
    private Long sectionId;
    private Integer paragraphNumber;
    private Long workingStatusParagraphVersionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
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
    
    public Integer getParagraphNumber() {
        return paragraphNumber;
    }
    
    public void setParagraphNumber(Integer paragraphNumber) {
        this.paragraphNumber = paragraphNumber;
    }
    
    public Long getWorkingStatusParagraphVersionId() {
        return workingStatusParagraphVersionId;
    }
    
    public void setWorkingStatusParagraphVersionId(Long workingStatusParagraphVersionId) {
        this.workingStatusParagraphVersionId = workingStatusParagraphVersionId;
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

