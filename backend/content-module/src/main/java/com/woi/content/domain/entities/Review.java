package com.woi.content.domain.entities;

import com.woi.content.domain.enums.ReviewStatus;
import java.time.LocalDateTime;

/**
 * Review domain entity - Pure POJO (no JPA annotations)
 * Represents a review record with status and metadata
 * 
 * Business logic:
 * - Status transitions: SUBMITTED → APPROVED/REJECTED
 * - When APPROVED: ContentStatus becomes PUBLISHED
 * - When REJECTED: ContentStatus becomes NEEDS_REVISION
 */
public class Review {
    private Long id;
    private Long reviewableItemId;
    private Long reviewedVersionId;  // ID of the version being reviewed
    private ReviewStatus status;
    private String comment;  // General review comment
    private Long submittedBy;  // User ID who submitted for review
    private Long reviewedBy;  // User ID who approved/rejected (supervisor)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Review() {}
    
    /**
     * Factory method: Create a new review (submitted)
     * 
     * @param reviewableItemId ReviewableItem ID (must not be null)
     * @param reviewedVersionId Version ID being reviewed (must not be null)
     * @param submittedBy User ID who submitted (must not be null)
     * @param comment Optional comment
     * @return New Review instance with status SUBMITTED
     * @throws IllegalArgumentException if validation fails
     */
    public static Review createSubmitted(Long reviewableItemId, Long reviewedVersionId, 
                                        Long submittedBy, String comment) {
        if (reviewableItemId == null) {
            throw new IllegalArgumentException("ReviewableItem ID cannot be null");
        }
        
        if (reviewedVersionId == null) {
            throw new IllegalArgumentException("Reviewed version ID cannot be null");
        }
        
        if (submittedBy == null) {
            throw new IllegalArgumentException("Submitted by (user ID) cannot be null");
        }
        
        Review review = new Review();
        review.reviewableItemId = reviewableItemId;
        review.reviewedVersionId = reviewedVersionId;
        review.status = ReviewStatus.SUBMITTED;
        review.comment = comment;
        review.submittedBy = submittedBy;
        review.createdAt = LocalDateTime.now();
        review.updatedAt = LocalDateTime.now();
        
        return review;
    }
    
    /**
     * Approve this review
     * 
     * @param reviewedBy User ID who approves (supervisor, must not be null)
     * @param comment Optional approval comment
     * @throws IllegalStateException if review is not in SUBMITTED status
     */
    public void approve(Long reviewedBy, String comment) {
        if (this.status != ReviewStatus.SUBMITTED) {
            throw new IllegalStateException("Review can only be approved if status is SUBMITTED. Current status: " + this.status);
        }
        
        if (reviewedBy == null) {
            throw new IllegalArgumentException("Reviewed by (user ID) cannot be null");
        }
        
        this.status = ReviewStatus.APPROVED;
        this.reviewedBy = reviewedBy;
        if (comment != null) {
            this.comment = comment;
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Reject this review
     * 
     * @param reviewedBy User ID who rejects (supervisor, must not be null)
     * @param comment Rejection comment (required)
     * @throws IllegalStateException if review is not in SUBMITTED status
     */
    public void reject(Long reviewedBy, String comment) {
        if (this.status != ReviewStatus.SUBMITTED) {
            throw new IllegalStateException("Review can only be rejected if status is SUBMITTED. Current status: " + this.status);
        }
        
        if (reviewedBy == null) {
            throw new IllegalArgumentException("Reviewed by (user ID) cannot be null");
        }
        
        if (comment == null || comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection comment is required");
        }
        
        this.status = ReviewStatus.REJECTED;
        this.reviewedBy = reviewedBy;
        this.comment = comment;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters (immutable - no setters for business fields)
    public Long getId() { return id; }
    public Long getReviewableItemId() { return reviewableItemId; }
    public Long getReviewedVersionId() { return reviewedVersionId; }
    public ReviewStatus getStatus() { return status; }
    public String getComment() { return comment; }
    public Long getSubmittedBy() { return submittedBy; }
    public Long getReviewedBy() { return reviewedBy; }
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
     * Setter for reviewableItemId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setReviewableItemId(Long reviewableItemId) { this.reviewableItemId = reviewableItemId; }
    
    /**
     * Setter for reviewedVersionId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setReviewedVersionId(Long reviewedVersionId) { this.reviewedVersionId = reviewedVersionId; }
    
    /**
     * Setter for status - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use approve() or reject() methods instead
     */
    public void setStatus(ReviewStatus status) { this.status = status; }
    
    /**
     * Setter for comment - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setComment(String comment) { this.comment = comment; }
    
    /**
     * Setter for submittedBy - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setSubmittedBy(Long submittedBy) { this.submittedBy = submittedBy; }
    
    /**
     * Setter for reviewedBy - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use approve() or reject() methods instead
     */
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
}

