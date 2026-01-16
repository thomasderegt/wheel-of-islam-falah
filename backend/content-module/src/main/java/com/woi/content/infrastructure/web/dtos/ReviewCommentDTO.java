package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for ReviewComment response
 */
public class ReviewCommentDTO {
    private Long id;
    private Long reviewId;
    private Long reviewedVersionId;
    private String fieldName;
    private String commentText;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    
    public Long getReviewedVersionId() { return reviewedVersionId; }
    public void setReviewedVersionId(Long reviewedVersionId) { this.reviewedVersionId = reviewedVersionId; }
    
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    
    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static ReviewCommentDTO from(com.woi.content.application.results.ReviewCommentResult result) {
        ReviewCommentDTO dto = new ReviewCommentDTO();
        dto.setId(result.id());
        dto.setReviewId(result.reviewId());
        dto.setReviewedVersionId(result.reviewedVersionId());
        dto.setFieldName(result.fieldName());
        dto.setCommentText(result.commentText());
        dto.setCreatedBy(result.createdBy());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
}
