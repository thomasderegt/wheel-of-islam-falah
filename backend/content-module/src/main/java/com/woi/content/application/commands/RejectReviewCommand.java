package com.woi.content.application.commands;

/**
 * Command for rejecting a review
 */
public record RejectReviewCommand(
    Long reviewId,
    Long reviewedBy,
    String comment
) {
    public RejectReviewCommand {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (reviewedBy == null) {
            throw new IllegalArgumentException("Reviewed by (user ID) cannot be null");
        }
        if (comment == null || comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection comment cannot be null or empty");
        }
    }
}

