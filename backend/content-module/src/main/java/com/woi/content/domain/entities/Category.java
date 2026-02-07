package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Category domain entity - Pure POJO (no JPA annotations)
 * Top level of content hierarchy
 * 
 * Business logic:
 * - Title fallback logic (als titleNl null is, gebruik titleEn en vice versa)
 * - Ten minste één title moet aanwezig zijn
 */
public class Category {
    private Long id;
    private Integer categoryNumber;  // Optional (for stable codes like CAT01)
    private String titleNl;
    private String titleEn;
    private String subtitleNl;
    private String subtitleEn;
    private String descriptionNl;
    private String descriptionEn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Category() {}
    
    /**
     * Factory method: Create a new category with fallback logic for titles
     * 
     * Business rule: Als titleNl null is, gebruik titleEn als fallback en vice versa
     * Ten minste één title moet aanwezig zijn
     * 
     * @param titleNl Dutch title (kan null zijn)
     * @param titleEn English title (kan null zijn)
     * @param descriptionNl Dutch description (optioneel)
     * @param descriptionEn English description (optioneel)
     * @return New Category instance
     * @throws IllegalArgumentException als beide titles null zijn
     */
    public static Category create(String titleNl, String titleEn, String descriptionNl, String descriptionEn) {
        // Validatie: ten minste één title moet aanwezig zijn
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        
        Category category = new Category();
        // Fallback logic: als titleNl null is, gebruik titleEn
        category.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        // Fallback logic: als titleEn null is, gebruik titleNl
        category.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        category.descriptionNl = descriptionNl;
        category.descriptionEn = descriptionEn;
        category.createdAt = LocalDateTime.now();
        category.updatedAt = LocalDateTime.now();
        
        return category;
    }
    
    /**
     * Update titles met fallback logic
     * 
     * @param titleNl Dutch title (kan null zijn)
     * @param titleEn English title (kan null zijn)
     * @throws IllegalArgumentException als beide titles null zijn
     */
    public void updateTitles(String titleNl, String titleEn) {
        // Validatie: ten minste één title moet aanwezig zijn
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        
        // Fallback logic
        this.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        this.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update descriptions
     */
    public void updateDescriptions(String descriptionNl, String descriptionEn) {
        this.descriptionNl = descriptionNl;
        this.descriptionEn = descriptionEn;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update alle content
     */
    public void updateContent(String titleNl, String titleEn, String descriptionNl, String descriptionEn) {
        updateTitles(titleNl, titleEn);
        updateDescriptions(descriptionNl, descriptionEn);
    }
    
    // Getters
    public Long getId() { return id; }
    public Integer getCategoryNumber() { return categoryNumber; }
    public String getTitleNl() { return titleNl; }
    public String getTitleEn() { return titleEn; }
    public String getSubtitleNl() { return subtitleNl; }
    public String getSubtitleEn() { return subtitleEn; }
    public String getDescriptionNl() { return descriptionNl; }
    public String getDescriptionEn() { return descriptionEn; }
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
     * Setter for categoryNumber - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     * Note: Category number 0 is allowed for Falah (central category)
     */
    public void setCategoryNumber(Integer categoryNumber) {
        if (categoryNumber != null && categoryNumber < 0) {
            throw new IllegalArgumentException("Category number must be a non-negative integer");
        }
        this.categoryNumber = categoryNumber;
    }
    
    /**
     * Setter for titleNl - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateTitles() method instead
     */
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    /**
     * Setter for titleEn - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateTitles() method instead
     */
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    /**
     * Setter for descriptionNl - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateDescriptions() method instead
     */
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    
    /**
     * Setter for descriptionEn - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateDescriptions() method instead
     */
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    /**
     * Setter for subtitleNl - ONLY for entity mapping (infrastructure layer)
     */
    public void setSubtitleNl(String subtitleNl) { this.subtitleNl = subtitleNl; }
    
    /**
     * Setter for subtitleEn - ONLY for entity mapping (infrastructure layer)
     */
    public void setSubtitleEn(String subtitleEn) { this.subtitleEn = subtitleEn; }
    
    /**
     * Get entity type for ContentStatus lookup
     * 
     * @return Entity type string
     */
    public String getEntityTypeForStatus() {
        return "category";
    }
}

