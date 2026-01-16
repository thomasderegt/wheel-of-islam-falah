package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteReviewCommentCommand;
import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a review comment
 * 
 * Responsibilities:
 * - Find comment
 * - Validate user is the creator
 * - Delete comment
 */
@Component
public class DeleteReviewCommentCommandHandler {
    private final ReviewCommentRepository reviewCommentRepository;
    
    public DeleteReviewCommentCommandHandler(ReviewCommentRepository reviewCommentRepository) {
        this.reviewCommentRepository = reviewCommentRepository;
    }
    
    @Transactional
    public void handle(DeleteReviewCommentCommand command) {
        // 1. Find comment
        ReviewComment comment = reviewCommentRepository.findById(command.commentId())
            .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + command.commentId()));
        
        // 2. Validate user is the creator
        if (!comment.getCreatedBy().equals(command.userId())) {
            throw new IllegalStateException("Only the comment creator can delete the comment");
        }
        
        // 3. Delete comment
        reviewCommentRepository.delete(comment);
    }
}
