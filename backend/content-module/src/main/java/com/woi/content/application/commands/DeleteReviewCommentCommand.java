package com.woi.content.application.commands;

/**
 * Command for deleting a review comment
 */
public record DeleteReviewCommentCommand(
    Long commentId,
    Long userId
) {
    public DeleteReviewCommentCommand {
        if (commentId == null) {
            throw new IllegalArgumentException("Comment ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
