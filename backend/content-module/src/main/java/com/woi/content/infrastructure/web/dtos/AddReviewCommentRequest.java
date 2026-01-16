package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for adding a review comment
 */
public class AddReviewCommentRequest {
    
    @NotNull(message = "Reviewed version ID is required")
    private Long reviewedVersionId;
    
    @NotBlank(message = "Field name is required")
    private String fieldName;
    
    @NotBlank(message = "Comment text is required")
    private String commentText;
    
    public Long getReviewedVersionId() {
        return reviewedVersionId;
    }
    
    public void setReviewedVersionId(Long reviewedVersionId) {
        this.reviewedVersionId = reviewedVersionId;
    }
    
    public String getFieldName() {
        return fieldName;
    }
    
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
    
    public String getCommentText() {
        return commentText;
    }
    
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
