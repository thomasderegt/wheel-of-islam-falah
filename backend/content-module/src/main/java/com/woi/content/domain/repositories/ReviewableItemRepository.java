package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.ReviewableItem;
import com.woi.content.domain.enums.ReviewableType;

import java.util.Optional;

/**
 * ReviewableItem repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ReviewableItemRepository {
    Optional<ReviewableItem> findById(Long id);
    Optional<ReviewableItem> findByTypeAndReferenceId(ReviewableType type, Long referenceId);
    ReviewableItem save(ReviewableItem reviewableItem);
    void delete(ReviewableItem reviewableItem);
}

