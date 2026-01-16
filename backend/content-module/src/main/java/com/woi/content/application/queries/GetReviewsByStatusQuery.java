package com.woi.content.application.queries;

import com.woi.content.domain.enums.ReviewStatus;

/**
 * Query for getting reviews by status
 */
public record GetReviewsByStatusQuery(
    ReviewStatus status
) {
    public GetReviewsByStatusQuery {
        if (status == null) {
            throw new IllegalArgumentException("ReviewStatus cannot be null");
        }
    }
}

