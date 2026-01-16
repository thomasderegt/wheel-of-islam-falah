package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.ReviewComment;

import java.util.List;
import java.util.Optional;

/**
 * ReviewComment repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ReviewCommentRepository {
    Optional<ReviewComment> findById(Long id);
    List<ReviewComment> findByReviewId(Long reviewId);
    ReviewComment save(ReviewComment reviewComment);
    void delete(ReviewComment reviewComment);
    void deleteByReviewId(Long reviewId);
}

