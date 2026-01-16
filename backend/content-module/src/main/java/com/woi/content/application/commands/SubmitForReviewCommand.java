package com.woi.content.application.commands;

import com.woi.content.domain.enums.ReviewableType;

/**
 * Command for submitting content for review
 */
public record SubmitForReviewCommand(
    ReviewableType type,
    Long referenceId,
    Long versionId,
    Long submittedBy,
    String comment
) {
    public SubmitForReviewCommand {
        if (type == null) {
            throw new IllegalArgumentException("ReviewableType cannot be null");
        }
        if (referenceId == null) {
            throw new IllegalArgumentException("Reference ID cannot be null");
        }
        if (versionId == null) {
            throw new IllegalArgumentException("Version ID cannot be null");
        }
        if (submittedBy == null) {
            throw new IllegalArgumentException("Submitted by (user ID) cannot be null");
        }
    }
}

