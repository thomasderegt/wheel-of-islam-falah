package com.woi.content.application.queries;

/**
 * Query for getting a review by ID
 */
public record GetReviewQuery(
    Long reviewId
) {
    public GetReviewQuery {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
    }
}

