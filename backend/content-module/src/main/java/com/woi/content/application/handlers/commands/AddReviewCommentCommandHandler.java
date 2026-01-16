package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.AddReviewCommentCommand;
import com.woi.content.application.results.ReviewCommentResult;
import com.woi.content.domain.entities.Review;
import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for adding a review comment
 * 
 * Responsibilities:
 * - Validate review exists
 * - Validate field name based on reviewable type
 * - Create and save comment
 */
@Component
public class AddReviewCommentCommandHandler {
    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewRepository reviewRepository;
    
    public AddReviewCommentCommandHandler(
            ReviewCommentRepository reviewCommentRepository,
            ReviewRepository reviewRepository) {
        this.reviewCommentRepository = reviewCommentRepository;
        this.reviewRepository = reviewRepository;
    }
    
    @Transactional
    public ReviewCommentResult handle(AddReviewCommentCommand command) {
        // 1. Validate review exists
        reviewRepository.findById(command.reviewId())
            .orElseThrow(() -> new IllegalArgumentException("Review not found: " + command.reviewId()));
        
        // 2. Validate field name based on reviewable type
        // This validation could be more sophisticated, but for now we'll allow any field name
        // The frontend should ensure valid field names
        
        // 3. Create and save comment
        ReviewComment comment = ReviewComment.create(
            command.reviewId(),
            command.reviewedVersionId(),
            command.fieldName(),
            command.commentText(),
            command.createdBy()
        );
        
        ReviewComment saved = reviewCommentRepository.save(comment);
        
        // 4. Return result
        return ReviewCommentResult.from(saved);
    }
}
