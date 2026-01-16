package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * BookVersion domain entity - Pure POJO (no JPA annotations)
 * Immutable version of Book content
 * 
 * Business logic:
 * - Title fallback logic (als titleNl null is, gebruik titleEn en vice versa)
 * - Ten minste één title moet aanwezig zijn
 */
public class BookVersion {
    private Long id;
    private Long bookId;  // Soft reference
    private Integer versionNumber;
    private String titleEn;
    private String titleNl;
    private String introEn;
    private String introNl;
    private Long createdBy;  // User ID
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public BookVersion() {}
    
    /**
     * Factory method: Create a new book version
     * 
     * @param bookId Book ID (must not be null)
     * @param versionNumber Version number (must be positive)
     * @param titleEn English title (can be null)
     * @param titleNl Dutch title (can be null)
     * @param introEn English intro (optional)
     * @param introNl Dutch intro (optional)
     * @param createdBy User ID who created this version (must not be null)
     * @return New BookVersion instance
     * @throws IllegalArgumentException if validation fails
     */
    public static BookVersion create(Long bookId, Integer versionNumber,
                                    String titleEn, String titleNl,
                                    String introEn, String introNl,
                                    Long createdBy) {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
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
        
        BookVersion version = new BookVersion();
        version.bookId = bookId;
        version.versionNumber = versionNumber;
        
        // Fallback logic: als titleNl null is, gebruik titleEn
        version.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        // Fallback logic: als titleEn null is, gebruik titleNl
        version.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        
        version.introEn = introEn;
        version.introNl = introNl;
        version.createdBy = createdBy;
        version.createdAt = LocalDateTime.now();
        
        return version;
    }
    
    // Getters (immutable - no setters for business fields)
    public Long getId() { return id; }
    public Long getBookId() { return bookId; }
    public Integer getVersionNumber() { return versionNumber; }
    public String getTitleEn() { return titleEn; }
    public String getTitleNl() { return titleNl; }
    public String getIntroEn() { return introEn; }
    public String getIntroNl() { return introNl; }
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
     * Setter for bookId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setBookId(Long bookId) { this.bookId = bookId; }
    
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
     * Setter for introEn - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setIntroEn(String introEn) { this.introEn = introEn; }
    
    /**
     * Setter for introNl - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setIntroNl(String introNl) { this.introNl = introNl; }
    
    /**
     * Setter for createdBy - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}

