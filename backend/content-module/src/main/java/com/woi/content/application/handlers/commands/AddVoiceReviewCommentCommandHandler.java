package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.AddVoiceReviewCommentCommand;
import com.woi.content.application.results.ReviewCommentResult;
import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import com.woi.content.domain.repositories.ReviewRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AddVoiceReviewCommentCommandHandler {
    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewRepository reviewRepository;

    public AddVoiceReviewCommentCommandHandler(
            ReviewCommentRepository reviewCommentRepository,
            ReviewRepository reviewRepository) {
        this.reviewCommentRepository = reviewCommentRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public ReviewCommentResult handle(AddVoiceReviewCommentCommand command) {
        reviewRepository.findById(command.reviewId())
            .orElseThrow(() -> new IllegalArgumentException("Review not found: " + command.reviewId()));

        String audioUrl = "/api/v2/content/review-comments/audio/" + command.audioFilename();
        ReviewComment comment = ReviewComment.createVoice(
            command.reviewId(),
            command.reviewedVersionId(),
            command.fieldName(),
            audioUrl,
            command.createdBy()
        );

        ReviewComment saved = reviewCommentRepository.save(comment);
        return ReviewCommentResult.from(saved);
    }
}
