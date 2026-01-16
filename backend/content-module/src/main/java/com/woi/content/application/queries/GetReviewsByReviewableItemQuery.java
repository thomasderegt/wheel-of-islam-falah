package com.woi.content.application.queries;

import com.woi.content.domain.enums.ReviewableType;

/**
 * Query for getting reviews by reviewable item
 */
public record GetReviewsByReviewableItemQuery(
    ReviewableType type,
    Long referenceId
) {
    public GetReviewsByReviewableItemQuery {
        if (type == null) {
            throw new IllegalArgumentException("ReviewableType cannot be null");
        }
        if (referenceId == null) {
            throw new IllegalArgumentException("Reference ID cannot be null");
        }
    }
}

