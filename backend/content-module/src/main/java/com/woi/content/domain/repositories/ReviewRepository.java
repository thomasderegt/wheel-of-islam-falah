package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Review;
import com.woi.content.domain.enums.ReviewStatus;
import com.woi.content.domain.enums.ReviewableType;

import java.util.List;
import java.util.Optional;

/**
 * Review repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ReviewRepository {
    Optional<Review> findById(Long id);
    List<Review> findByReviewableItemId(Long reviewableItemId);
    List<Review> findByStatus(ReviewStatus status);
    Optional<Review> findApprovedReviewByTypeAndReferenceId(ReviewableType type, Long referenceId);
    List<Review> findByTypeAndReferenceId(ReviewableType type, Long referenceId);
    Review save(Review review);
    void delete(Review review);
}

