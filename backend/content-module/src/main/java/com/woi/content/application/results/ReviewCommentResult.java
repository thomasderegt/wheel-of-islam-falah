package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for ReviewComment operations
 */
public record ReviewCommentResult(
    Long id,
    Long reviewId,
    Long reviewedVersionId,
    String fieldName,
    String commentText,
    Long createdBy,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ReviewCommentResult from(com.woi.content.domain.entities.ReviewComment comment) {
        return new ReviewCommentResult(
            comment.getId(),
            comment.getReviewId(),
            comment.getReviewedVersionId(),
            comment.getFieldName(),
            comment.getCommentText(),
            comment.getCreatedBy(),
            comment.getCreatedAt(),
            comment.getUpdatedAt()
        );
    }
}

