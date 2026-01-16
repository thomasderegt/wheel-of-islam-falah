package com.woi.content.domain.entities;

import com.woi.content.domain.enums.ContentStatusType;

import java.time.LocalDateTime;

/**
 * ContentStatus domain entity - Pure POJO (no JPA annotations)
 * Tracks the publication workflow status of content items (polymorphic)
 * 
 * v1: Only DRAFT and PUBLISHED status
 * v2: Will add IN_REVIEW, NEEDS_REVISION, APPROVED
 */
public class ContentStatus {
    private Long id;
    private String entityType;  // 'section', 'paragraph', 'chapter', 'book', 'category'
    private Long entityId;
    private ContentStatusType status;  // DRAFT, PUBLISHED (v1)
    private Long userId;  // User who set this status (optional)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public ContentStatus() {}
    
    /**
     * Factory method: Create a new ContentStatus
     * 
     * @param entityType Entity type ('section', 'paragraph', 'chapter', 'book', 'category')
     * @param entityId Entity ID
     * @param status Status (DRAFT or PUBLISHED in v1)
     * @param userId User ID (optional)
     * @return New ContentStatus instance
     * @throws IllegalArgumentException if validation fails
     */
    public static ContentStatus create(String entityType, Long entityId, ContentStatusType status, Long userId) {
        if (entityType == null || entityType.trim().isEmpty()) {
            throw new IllegalArgumentException("Entity type cannot be null or empty");
        }
        if (entityId == null) {
            throw new IllegalArgumentException("Entity ID cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        
        ContentStatus contentStatus = new ContentStatus();
        contentStatus.entityType = entityType.toLowerCase();
        contentStatus.entityId = entityId;
        contentStatus.status = status;
        contentStatus.userId = userId;
        contentStatus.createdAt = LocalDateTime.now();
        contentStatus.updatedAt = LocalDateTime.now();
        
        return contentStatus;
    }
    
    /**
     * Update status
     * 
     * @param newStatus New status value
     * @param userId User ID who made the change (optional)
     * @throws IllegalArgumentException if newStatus is null
     */
    public void updateStatus(ContentStatusType newStatus, Long userId) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        this.status = newStatus;
        this.userId = userId;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getEntityType() { return entityType; }
    public Long getEntityId() { return entityId; }
    public ContentStatusType getStatus() { return status; }
    public Long getUserId() { return userId; }
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
     * Setter for entityType - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    /**
     * Setter for entityId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    /**
     * Setter for status - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateStatus() method instead
     */
    public void setStatus(ContentStatusType status) { this.status = status; }
    
    /**
     * Setter for userId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUserId(Long userId) { this.userId = userId; }
}

