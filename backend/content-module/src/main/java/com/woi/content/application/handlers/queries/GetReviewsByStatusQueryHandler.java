package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewsByStatusQuery;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting reviews by status
 */
@Component
public class GetReviewsByStatusQueryHandler {
    private final ReviewRepository reviewRepository;
    
    public GetReviewsByStatusQueryHandler(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    public List<ReviewResult> handle(GetReviewsByStatusQuery query) {
        return reviewRepository.findByStatus(query.status()).stream()
            .map(ReviewResult::from)
            .collect(Collectors.toList());
    }
}

