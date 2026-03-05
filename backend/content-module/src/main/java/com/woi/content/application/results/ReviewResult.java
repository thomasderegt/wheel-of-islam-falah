package com.woi.content.application.results;

import com.woi.content.domain.enums.ReviewStatus;

import java.time.LocalDateTime;

/**
 * Result DTO for Review operations
 */
public record ReviewResult(
    Long id,
    Long reviewableItemId,
    Long reviewedVersionId,
    ReviewStatus status,
    String comment,
    Long submittedBy,
    Long reviewedBy,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String entityType,
    String title,
    Long referenceId,
    ReviewVersionContent versionContent
) {
    public static ReviewResult from(com.woi.content.domain.entities.Review review) {
        return from(review, "", "", null, ReviewVersionContent.empty());
    }

    public static ReviewResult from(com.woi.content.domain.entities.Review review,
            String entityType, String title, Long referenceId, ReviewVersionContent versionContent) {
        return new ReviewResult(
            review.getId(),
            review.getReviewableItemId(),
            review.getReviewedVersionId(),
            review.getStatus(),
            review.getComment(),
            review.getSubmittedBy(),
            review.getReviewedBy(),
            review.getCreatedAt(),
            review.getUpdatedAt(),
            entityType != null ? entityType : "",
            title != null ? title : "",
            referenceId,
            versionContent != null ? versionContent : ReviewVersionContent.empty()
        );
    }
}

