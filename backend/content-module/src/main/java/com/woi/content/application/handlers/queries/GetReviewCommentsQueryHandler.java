package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewCommentsQuery;
import com.woi.content.application.results.ReviewCommentResult;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all comments for a review
 */
@Component
public class GetReviewCommentsQueryHandler {
    private final ReviewCommentRepository reviewCommentRepository;
    
    public GetReviewCommentsQueryHandler(ReviewCommentRepository reviewCommentRepository) {
        this.reviewCommentRepository = reviewCommentRepository;
    }
    
    @Transactional(readOnly = true)
    public List<ReviewCommentResult> handle(GetReviewCommentsQuery query) {
        List<com.woi.content.domain.entities.ReviewComment> comments = 
            reviewCommentRepository.findByReviewId(query.reviewId());
        
        // Sort by created date ascending
        return comments.stream()
            .sorted(Comparator.comparing(com.woi.content.domain.entities.ReviewComment::getCreatedAt))
            .map(ReviewCommentResult::from)
            .collect(Collectors.toList());
    }
}
