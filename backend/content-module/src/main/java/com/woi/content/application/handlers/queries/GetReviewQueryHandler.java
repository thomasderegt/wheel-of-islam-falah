package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewQuery;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.domain.entities.Review;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Query handler for getting a review by ID with enriched data (entityType, title, referenceId)
 */
@Component
public class GetReviewQueryHandler {
    private final ReviewRepository reviewRepository;
    private final GetReviewsByStatusQueryHandler reviewsByStatusHandler;

    public GetReviewQueryHandler(ReviewRepository reviewRepository,
            GetReviewsByStatusQueryHandler reviewsByStatusHandler) {
        this.reviewRepository = reviewRepository;
        this.reviewsByStatusHandler = reviewsByStatusHandler;
    }

    public Optional<ReviewResult> handle(GetReviewQuery query) {
        return reviewRepository.findById(query.reviewId())
            .map(review -> {
                // Reuse enrichment from GetReviewsByStatusQueryHandler via reflection/call
                // Simpler: duplicate the enrichment - but that creates circular dependency
                // Better: extract enrichment to a shared service or have GetReviewQueryHandler
                // inject the same deps and call a shared method
                return reviewsByStatusHandler.enrichReview(review);
            });
    }
}

