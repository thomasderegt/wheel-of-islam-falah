package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Section domain entity - Pure POJO (no JPA annotations)
 * Represents a section within a chapter (structural metadata only)
 * Content (title, intro) is in SectionVersion
 */
public class Section {
    private Long id;
    private Long chapterId;  // Soft reference (no direct Chapter entity dependency)
    private Integer orderIndex;  // Order/number within the chapter
    private Long workingStatusSectionVersionId;  // Pointer to current working version
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Section() {}
    
    /**
     * Factory method: Create a new section with structural metadata only
     * 
     * @param chapterId Chapter ID (must not be null)
     * @param orderIndex Order index (must be non-negative)
     * @return New Section instance
     * @throws IllegalArgumentException if chapterId is null or orderIndex is invalid
     */
    public static Section create(Long chapterId, Integer orderIndex) {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
        
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be a non-negative integer");
        }
        
        Section section = new Section();
        section.chapterId = chapterId;
        section.orderIndex = orderIndex;
        section.createdAt = LocalDateTime.now();
        section.updatedAt = LocalDateTime.now();
        section.workingStatusSectionVersionId = null;
        
        return section;
    }
    
    /**
     * Update order index
     * 
     * @param orderIndex New order index (must be non-negative)
     * @throws IllegalArgumentException if orderIndex is invalid
     */
    public void updateOrderIndex(Integer orderIndex) {
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be a non-negative integer");
        }
        this.orderIndex = orderIndex;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Set working status section version ID
     * Called by handlers to update the current working version pointer
     * 
     * @param versionId Version ID (can be null)
     */
    public void setWorkingStatusSectionVersionId(Long versionId) {
        this.workingStatusSectionVersionId = versionId;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getChapterId() { return chapterId; }
    public Integer getOrderIndex() { return orderIndex; }
    public Long getWorkingStatusSectionVersionId() { return workingStatusSectionVersionId; }
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
     * Setter for chapterId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setChapterId(Long chapterId) { this.chapterId = chapterId; }
    
    /**
     * Setter for orderIndex - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateOrderIndex() method instead
     */
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    /**
     * Get entity type for ContentStatus lookup
     * 
     * @return Entity type string
     */
    public String getEntityTypeForStatus() {
        return "section";
    }
}

