package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a paragraph
 */
public class CreateParagraphRequestDTO {
    
    @NotNull(message = "Section ID is verplicht")
    private Long sectionId;
    
    @NotNull(message = "Paragraph number is verplicht")
    @Min(value = 1, message = "Paragraph number must be a positive integer")
    private Integer paragraphNumber;
    
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
}

