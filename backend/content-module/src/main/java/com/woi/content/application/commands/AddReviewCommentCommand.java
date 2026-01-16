package com.woi.content.application.commands;

/**
 * Command for adding a review comment
 */
public record AddReviewCommentCommand(
    Long reviewId,
    Long reviewedVersionId,
    String fieldName,
    String commentText,
    Long createdBy
) {
    public AddReviewCommentCommand {
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
    }
}
