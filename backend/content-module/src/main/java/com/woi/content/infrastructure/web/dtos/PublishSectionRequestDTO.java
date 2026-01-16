package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for publishing a section
 */
public class PublishSectionRequestDTO {
    
    @NotNull(message = "Section ID is verplicht")
    private Long sectionId;
    
    @NotNull(message = "User ID is verplicht")
    private Long userId;
    
    public Long getSectionId() {
        return sectionId;
    }
    
    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

