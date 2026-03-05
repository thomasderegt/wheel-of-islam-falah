package com.woi.content.application.commands;

/**
 * Command for adding a voice recording as a review comment
 */
public record AddVoiceReviewCommentCommand(
    Long reviewId,
    Long reviewedVersionId,
    String fieldName,
    String audioFilename,
    Long createdBy
) {
    public AddVoiceReviewCommentCommand {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (reviewedVersionId == null) {
            throw new IllegalArgumentException("Reviewed version ID cannot be null");
        }
        if (fieldName == null || fieldName.trim().isEmpty()) {
            throw new IllegalArgumentException("Field name cannot be null or empty");
        }
        if (audioFilename == null || audioFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("Audio filename cannot be null or empty");
        }
        if (createdBy == null) {
            throw new IllegalArgumentException("Created by (user ID) cannot be null");
        }
    }
}
