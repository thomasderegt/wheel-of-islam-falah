package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewsByReviewableItemQuery;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting reviews by reviewable item
 */
@Component
public class GetReviewsByReviewableItemQueryHandler {
    private final ReviewRepository reviewRepository;
    
    public GetReviewsByReviewableItemQueryHandler(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    public List<ReviewResult> handle(GetReviewsByReviewableItemQuery query) {
        return reviewRepository.findByTypeAndReferenceId(query.type(), query.referenceId()).stream()
            .map(ReviewResult::from)
            .collect(Collectors.toList());
    }
}

