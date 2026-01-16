package com.woi.content.application.commands;

/**
 * Command for approving a review
 */
public record ApproveReviewCommand(
    Long reviewId,
    Long reviewedBy,
    String comment
) {
    public ApproveReviewCommand {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (reviewedBy == null) {
            throw new IllegalArgumentException("Reviewed by (user ID) cannot be null");
        }
    }
}

