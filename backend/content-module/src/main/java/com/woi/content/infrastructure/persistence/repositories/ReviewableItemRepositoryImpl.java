package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.ReviewableItem;
import com.woi.content.domain.enums.ReviewableType;
import com.woi.content.domain.repositories.ReviewableItemRepository;
import com.woi.content.infrastructure.persistence.entities.ReviewableItemJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ReviewableItemEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repository implementation for ReviewableItem
 */
@Repository
public class ReviewableItemRepositoryImpl implements ReviewableItemRepository {
    
    private final ReviewableItemJpaRepository jpaRepository;
    
    public ReviewableItemRepositoryImpl(ReviewableItemJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ReviewableItem> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ReviewableItemEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ReviewableItem> findByTypeAndReferenceId(ReviewableType type, Long referenceId) {
        return jpaRepository.findByTypeAndReferenceId(type.name(), referenceId)
            .map(ReviewableItemEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public ReviewableItem save(ReviewableItem reviewableItem) {
        ReviewableItemJpaEntity jpaEntity = ReviewableItemEntityMapper.toJpa(reviewableItem);
        ReviewableItemJpaEntity saved = jpaRepository.save(jpaEntity);
        return ReviewableItemEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(ReviewableItem reviewableItem) {
        jpaRepository.deleteById(reviewableItem.getId());
    }
}

