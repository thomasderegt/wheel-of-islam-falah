package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * ReviewComment domain entity - Pure POJO (no JPA annotations)
 * Field-level comment on a specific field of a version
 * 
 * Business logic:
 * - Comments are bound to a specific review and field
 * - Field names: titleNl, titleEn, contentEn, contentNl, introEn, introNl, etc.
 */
public class ReviewComment {
    private Long id;
    private Long reviewId;
    private Long reviewedVersionId;  // ID of the version being reviewed
    private String fieldName;  // titleNl, titleEn, contentEn, etc.
    private String commentText;
    private Long createdBy;  // User ID who created the comment
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public ReviewComment() {}
    
    /**
     * Factory method: Create a new review comment
     * 
     * @param reviewId Review ID (must not be null)
     * @param reviewedVersionId Version ID being reviewed (must not be null)
     * @param fieldName Field name (must not be null or empty)
     * @param commentText Comment text (must not be null or empty)
     * @param createdBy User ID who created the comment (must not be null)
     * @return New ReviewComment instance
     * @throws IllegalArgumentException if validation fails
     */
    public static ReviewComment create(Long reviewId, Long reviewedVersionId, String fieldName, String commentText, Long createdBy) {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        
        if (reviewedVersionId == null) {
            throw new IllegalArgumentException("Reviewed version ID cannot be null");
        }
        
        if (fieldName == null || fieldName.trim().isEmpty()) {
            throw new IllegalArgumentException("Field name cannot be null or empty");
        }
        
        if (commentText == null || commentText.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be null or empty");
        }
        
        if (createdBy == null) {
            throw new IllegalArgumentException("Created by (user ID) cannot be null");
        }
        
        ReviewComment comment = new ReviewComment();
        comment.reviewId = reviewId;
        comment.reviewedVersionId = reviewedVersionId;
        comment.fieldName = fieldName;
        comment.commentText = commentText;
        comment.createdBy = createdBy;
        LocalDateTime now = LocalDateTime.now();
        comment.createdAt = now;
        comment.updatedAt = now;
        
        return comment;
    }
    
    /**
     * Update the comment text
     * 
     * @param newCommentText New comment text (must not be null or empty)
     * @throws IllegalArgumentException if validation fails
     */
    public void updateCommentText(String newCommentText) {
        if (newCommentText == null || newCommentText.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be null or empty");
        }
        this.commentText = newCommentText;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters (immutable - no setters for business fields)
    public Long getId() { return id; }
    public Long getReviewId() { return reviewId; }
    public Long getReviewedVersionId() { return reviewedVersionId; }
    public String getFieldName() { return fieldName; }
    public String getCommentText() { return commentText; }
    public Long getCreatedBy() { return createdBy; }
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
     * Setter for reviewId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    
    /**
     * Setter for fieldName - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    
    /**
     * Setter for commentText - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCommentText(String commentText) { this.commentText = commentText; }
    
    /**
     * Setter for createdBy - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    /**
     * Setter for reviewedVersionId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setReviewedVersionId(Long reviewedVersionId) { this.reviewedVersionId = reviewedVersionId; }
    
    /**
     * Setter for updatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

