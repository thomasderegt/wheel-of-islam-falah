package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for updating a review comment
 */
public class UpdateReviewCommentRequest {
    
    @NotBlank(message = "Comment text is required")
    private String commentText;
    
    public String getCommentText() {
        return commentText;
    }
    
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
