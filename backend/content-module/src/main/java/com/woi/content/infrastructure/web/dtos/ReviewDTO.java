package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Review response
 */
public class ReviewDTO {
    private Long id;
    private Long reviewableItemId;
    private Long reviewedVersionId;
    private String status;  // SUBMITTED, APPROVED, REJECTED
    private String comment;
    private Long submittedBy;
    private Long reviewedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getReviewableItemId() { return reviewableItemId; }
    public void setReviewableItemId(Long reviewableItemId) { this.reviewableItemId = reviewableItemId; }
    
    public Long getReviewedVersionId() { return reviewedVersionId; }
    public void setReviewedVersionId(Long reviewedVersionId) { this.reviewedVersionId = reviewedVersionId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    
    public Long getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(Long submittedBy) { this.submittedBy = submittedBy; }
    
    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static ReviewDTO from(com.woi.content.application.results.ReviewResult result) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(result.id());
        dto.setReviewableItemId(result.reviewableItemId());
        dto.setReviewedVersionId(result.reviewedVersionId());
        dto.setStatus(result.status().name());
        dto.setComment(result.comment());
        dto.setSubmittedBy(result.submittedBy());
        dto.setReviewedBy(result.reviewedBy());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
}

