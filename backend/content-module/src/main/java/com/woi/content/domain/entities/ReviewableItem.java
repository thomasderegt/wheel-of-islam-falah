package com.woi.content.domain.entities;

import com.woi.content.domain.enums.ReviewableType;
import java.time.LocalDateTime;

/**
 * ReviewableItem domain entity - Pure POJO (no JPA annotations)
 * Polymorphic routing entity that links reviewable entities to reviews
 * 
 * Business logic:
 * - Automatically created when first review is submitted
 * - One ReviewableItem per entity (unique constraint: type + referenceId)
 */
public class ReviewableItem {
    private Long id;
    private ReviewableType type;
    private Long referenceId;  // ID of the reviewable entity (Section, Paragraph, etc.)
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public ReviewableItem() {}
    
    /**
     * Factory method: Create a new reviewable item
     * 
     * @param type ReviewableType (must not be null)
     * @param referenceId ID of the reviewable entity (must not be null)
     * @return New ReviewableItem instance
     * @throws IllegalArgumentException if validation fails
     */
    public static ReviewableItem create(ReviewableType type, Long referenceId) {
        if (type == null) {
            throw new IllegalArgumentException("ReviewableType cannot be null");
        }
        
        if (referenceId == null) {
            throw new IllegalArgumentException("Reference ID cannot be null");
        }
        
        ReviewableItem item = new ReviewableItem();
        item.type = type;
        item.referenceId = referenceId;
        item.createdAt = LocalDateTime.now();
        
        return item;
    }
    
    // Getters (immutable - no setters for business fields)
    public Long getId() { return id; }
    public ReviewableType getType() { return type; }
    public Long getReferenceId() { return referenceId; }
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
     * Setter for type - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setType(ReviewableType type) { this.type = type; }
    
    /**
     * Setter for referenceId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }
}

