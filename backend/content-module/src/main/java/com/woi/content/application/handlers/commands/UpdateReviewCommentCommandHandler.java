package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateReviewCommentCommand;
import com.woi.content.application.results.ReviewCommentResult;
import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating a review comment
 * 
 * Responsibilities:
 * - Find comment
 * - Validate user is the creator
 * - Update comment text
 */
@Component
public class UpdateReviewCommentCommandHandler {
    private final ReviewCommentRepository reviewCommentRepository;
    
    public UpdateReviewCommentCommandHandler(ReviewCommentRepository reviewCommentRepository) {
        this.reviewCommentRepository = reviewCommentRepository;
    }
    
    @Transactional
    public ReviewCommentResult handle(UpdateReviewCommentCommand command) {
        // 1. Find comment
        ReviewComment comment = reviewCommentRepository.findById(command.commentId())
            .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + command.commentId()));
        
        // 2. Validate user is the creator
        if (!comment.getCreatedBy().equals(command.userId())) {
            throw new IllegalStateException("Only the comment creator can update the comment");
        }
        
        // 3. Update comment text
        comment.updateCommentText(command.commentText());
        ReviewComment updated = reviewCommentRepository.save(comment);
        
        // 4. Return result
        return ReviewCommentResult.from(updated);
    }
}
