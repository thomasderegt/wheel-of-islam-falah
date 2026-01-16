package com.woi.content.application.commands;

/**
 * Command for updating a review comment
 */
public record UpdateReviewCommentCommand(
    Long commentId,
    String commentText,
    Long userId
) {
    public UpdateReviewCommentCommand {
        if (commentId == null) {
            throw new IllegalArgumentException("Comment ID cannot be null");
        }
        if (commentText == null || commentText.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be null or empty");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
