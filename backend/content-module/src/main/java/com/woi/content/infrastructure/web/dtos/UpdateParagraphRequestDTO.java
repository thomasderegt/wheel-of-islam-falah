package com.woi.content.infrastructure.web.dtos;

/**
 * DTO for updating a paragraph
 */
public class UpdateParagraphRequestDTO {
    
    private Integer paragraphNumber;
    
    public Integer getParagraphNumber() {
        return paragraphNumber;
    }
    
    public void setParagraphNumber(Integer paragraphNumber) {
        this.paragraphNumber = paragraphNumber;
    }
}

