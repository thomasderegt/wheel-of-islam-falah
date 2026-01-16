package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Paragraph domain entity - Pure POJO (no JPA annotations)
 * Represents a paragraph within a section (structural metadata only)
 * Content (title, content) is in ParagraphVersion (v2 - not implemented yet)
 * 
 * Business logic:
 * - Section validatie (moet niet null zijn)
 * - ParagraphNumber validatie (moet positief zijn)
 */
public class Paragraph {
    private Long id;
    private Long sectionId;  // Soft reference (no direct Section entity dependency)
    private Integer paragraphNumber;  // Order within the section (must be positive)
    private Long workingStatusParagraphVersionId;  // Pointer to current working version (v2 - not used in v1)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Paragraph() {}
    
    /**
     * Factory method: Create a new paragraph with structural metadata only
     * 
     * @param sectionId Section ID (must not be null)
     * @param paragraphNumber Paragraph number (must be positive)
     * @return New Paragraph instance
     * @throws IllegalArgumentException if sectionId is null or paragraphNumber is invalid
     */
    public static Paragraph create(Long sectionId, Integer paragraphNumber) {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        
        if (paragraphNumber == null || paragraphNumber < 1) {
            throw new IllegalArgumentException("ParagraphNumber must be a positive integer");
        }
        
        Paragraph paragraph = new Paragraph();
        paragraph.sectionId = sectionId;
        paragraph.paragraphNumber = paragraphNumber;
        paragraph.createdAt = LocalDateTime.now();
        paragraph.updatedAt = LocalDateTime.now();
        paragraph.workingStatusParagraphVersionId = null;
        
        return paragraph;
    }
    
    /**
     * Update paragraph number met validatie
     * 
     * @param paragraphNumber Nieuwe paragraph number
     * @throws IllegalArgumentException als paragraphNumber ongeldig is
     */
    public void updateParagraphNumber(int paragraphNumber) {
        if (paragraphNumber < 1) {
            throw new IllegalArgumentException("ParagraphNumber must be a positive integer");
        }
        this.paragraphNumber = paragraphNumber;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Set working status paragraph version ID
     * Called by handlers to update the current working version pointer (v2)
     * 
     * @param versionId Version ID (can be null)
     */
    public void setWorkingStatusParagraphVersionId(Long versionId) {
        this.workingStatusParagraphVersionId = versionId;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getSectionId() { return sectionId; }
    public Integer getParagraphNumber() { return paragraphNumber; }
    public Long getWorkingStatusParagraphVersionId() { return workingStatusParagraphVersionId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for createdAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    /**
     * Setter for updatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    /**
     * Setter for sectionId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    
    /**
     * Setter for paragraphNumber - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateParagraphNumber() method instead
     */
    public void setParagraphNumberInternal(Integer paragraphNumber) { this.paragraphNumber = paragraphNumber; }
    
    /**
     * Get entity type for ContentStatus lookup
     * 
     * @return Entity type string
     */
    public String getEntityTypeForStatus() {
        return "paragraph";
    }
}

