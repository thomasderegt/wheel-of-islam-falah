package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewQuery;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Query handler for getting a review by ID
 */
@Component
public class GetReviewQueryHandler {
    private final ReviewRepository reviewRepository;
    
    public GetReviewQueryHandler(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    public Optional<ReviewResult> handle(GetReviewQuery query) {
        return reviewRepository.findById(query.reviewId())
            .map(ReviewResult::from);
    }
}

