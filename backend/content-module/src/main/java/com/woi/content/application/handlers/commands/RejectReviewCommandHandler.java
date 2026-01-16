package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.RejectReviewCommand;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.entities.Review;
import com.woi.content.domain.entities.ReviewableItem;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.domain.repositories.ReviewRepository;
import com.woi.content.domain.repositories.ReviewableItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for rejecting a review
 * 
 * Responsibilities:
 * - Reject the review (domain method)
 * - Update ContentStatus to NEEDS_REVISION
 */
@Component
public class RejectReviewCommandHandler {
    private final ReviewRepository reviewRepository;
    private final ReviewableItemRepository reviewableItemRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public RejectReviewCommandHandler(
            ReviewRepository reviewRepository,
            ReviewableItemRepository reviewableItemRepository,
            ContentStatusRepository contentStatusRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewableItemRepository = reviewableItemRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    @Transactional
    public ReviewResult handle(RejectReviewCommand command) {
        // 1. Find review
        Review review = reviewRepository.findById(command.reviewId())
            .orElseThrow(() -> new IllegalArgumentException("Review not found: " + command.reviewId()));
        
        // 2. Reject review (domain method - validates status and requires comment)
        review.reject(command.reviewedBy(), command.comment());
        Review savedReview = reviewRepository.save(review);
        
        // 3. Update ContentStatus to NEEDS_REVISION
        ReviewableItem reviewableItem = reviewableItemRepository.findById(review.getReviewableItemId())
            .orElseThrow(() -> new IllegalStateException("ReviewableItem not found: " + review.getReviewableItemId()));
        
        String entityType = getEntityTypeForReviewableType(reviewableItem.getType());
        ContentStatus contentStatus = contentStatusRepository
            .findByEntityTypeAndEntityId(entityType, reviewableItem.getReferenceId())
            .orElseGet(() -> {
                // Create new ContentStatus if it doesn't exist
                return ContentStatus.create(
                    entityType,
                    reviewableItem.getReferenceId(),
                    ContentStatusType.DRAFT,
                    null
                );
            });
        
        contentStatus.updateStatus(ContentStatusType.NEEDS_REVISION, command.reviewedBy());
        contentStatusRepository.save(contentStatus);
        
        // 4. Return result
        return ReviewResult.from(savedReview);
    }
    
    private String getEntityTypeForReviewableType(com.woi.content.domain.enums.ReviewableType type) {
        return switch (type) {
            case SECTION -> "section";
            case PARAGRAPH -> "paragraph";
            case CHAPTER -> "chapter";
            case BOOK -> "book";
        };
    }
}

