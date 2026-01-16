package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.SubmitForReviewCommand;
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
 * Command handler for submitting content for review
 * 
 * Responsibilities:
 * - Create or find ReviewableItem
 * - Create Review with SUBMITTED status
 * - Update ContentStatus to IN_REVIEW
 */
@Component
public class SubmitForReviewCommandHandler {
    private final ReviewableItemRepository reviewableItemRepository;
    private final ReviewRepository reviewRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public SubmitForReviewCommandHandler(
            ReviewableItemRepository reviewableItemRepository,
            ReviewRepository reviewRepository,
            ContentStatusRepository contentStatusRepository) {
        this.reviewableItemRepository = reviewableItemRepository;
        this.reviewRepository = reviewRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    @Transactional
    public ReviewResult handle(SubmitForReviewCommand command) {
        // 1. Find or create ReviewableItem
        ReviewableItem reviewableItem = reviewableItemRepository
            .findByTypeAndReferenceId(command.type(), command.referenceId())
            .orElseGet(() -> {
                ReviewableItem newItem = ReviewableItem.create(command.type(), command.referenceId());
                return reviewableItemRepository.save(newItem);
            });
        
        // 2. Create Review with SUBMITTED status
        Review review = Review.createSubmitted(
            reviewableItem.getId(),
            command.versionId(),
            command.submittedBy(),
            command.comment()
        );
        Review savedReview = reviewRepository.save(review);
        
        // 3. Update ContentStatus to IN_REVIEW
        String entityType = getEntityTypeForReviewableType(command.type());
        ContentStatus contentStatus = contentStatusRepository
            .findByEntityTypeAndEntityId(entityType, command.referenceId())
            .orElseGet(() -> {
                // Create new ContentStatus if it doesn't exist
                return ContentStatus.create(
                    entityType,
                    command.referenceId(),
                    ContentStatusType.DRAFT,
                    null
                );
            });
        
        contentStatus.updateStatus(ContentStatusType.IN_REVIEW, command.submittedBy());
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

