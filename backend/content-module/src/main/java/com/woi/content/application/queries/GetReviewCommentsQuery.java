package com.woi.content.application.queries;

/**
 * Query for getting all comments for a review
 */
public record GetReviewCommentsQuery(
    Long reviewId
) {
    public GetReviewCommentsQuery {
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
    }
}
