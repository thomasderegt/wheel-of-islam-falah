package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * ParagraphVersion domain entity - Pure POJO (no JPA annotations)
 * Immutable version of Paragraph content
 * 
 * Business logic:
 * - Title fallback logic (als titleNl null is, gebruik titleEn en vice versa)
 * - Ten minste één title moet aanwezig zijn
 */
public class ParagraphVersion {
    private Long id;
    private Long paragraphId;  // Soft reference
    private Integer versionNumber;
    private String titleEn;
    private String titleNl;
    private String contentEn;
    private String contentNl;
    private Long createdBy;  // User ID
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public ParagraphVersion() {}
    
    /**
     * Factory method: Create a new paragraph version
     * 
     * @param paragraphId Paragraph ID (must not be null)
     * @param versionNumber Version number (must be positive)
     * @param titleEn English title (can be null)
     * @param titleNl Dutch title (can be null)
     * @param contentEn English content (optional)
     * @param contentNl Dutch content (optional)
     * @param createdBy User ID who created this version (must not be null)
     * @return New ParagraphVersion instance
     * @throws IllegalArgumentException if validation fails
     */
    public static ParagraphVersion create(Long paragraphId, Integer versionNumber,
                                         String titleEn, String titleNl,
                                         String contentEn, String contentNl,
                                         Long createdBy) {
        if (paragraphId == null) {
            throw new IllegalArgumentException("Paragraph ID cannot be null");
        }
        
        if (versionNumber == null || versionNumber < 1) {
            throw new IllegalArgumentException("Version number must be a positive integer");
        }
        
        // Validatie: ten minste één title moet aanwezig zijn
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        
        if (createdBy == null) {
            throw new IllegalArgumentException("Created by (user ID) cannot be null");
        }
        
        ParagraphVersion version = new ParagraphVersion();
        version.paragraphId = paragraphId;
        version.versionNumber = versionNumber;
        
        // Fallback logic: als titleNl null is, gebruik titleEn
        version.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        // Fallback logic: als titleEn null is, gebruik titleNl
        version.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        
        version.contentEn = contentEn;
        version.contentNl = contentNl;
        version.createdBy = createdBy;
        version.createdAt = LocalDateTime.now();
        
        return version;
    }
    
    // Getters (immutable - no setters for business fields)
    public Long getId() { return id; }
    public Long getParagraphId() { return paragraphId; }
    public Integer getVersionNumber() { return versionNumber; }
    public String getTitleEn() { return titleEn; }
    public String getTitleNl() { return titleNl; }
    public String getContentEn() { return contentEn; }
    public String getContentNl() { return contentNl; }
    public Long getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
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
     * Setter for paragraphId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setParagraphId(Long paragraphId) { this.paragraphId = paragraphId; }
    
    /**
     * Setter for versionNumber - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }
    
    /**
     * Setter for titleEn - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    /**
     * Setter for titleNl - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    /**
     * Setter for contentEn - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    /**
     * Setter for contentNl - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setContentNl(String contentNl) { this.contentNl = contentNl; }
    
    /**
     * Setter for createdBy - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}

