package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Review;
import com.woi.content.domain.enums.ReviewStatus;
import com.woi.content.domain.enums.ReviewableType;
import com.woi.content.domain.repositories.ReviewRepository;
import com.woi.content.infrastructure.persistence.entities.ReviewJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ReviewEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Review
 */
@Repository
public class ReviewRepositoryImpl implements ReviewRepository {
    
    private final ReviewJpaRepository jpaRepository;
    
    public ReviewRepositoryImpl(ReviewJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Review> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ReviewEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Review> findByReviewableItemId(Long reviewableItemId) {
        return jpaRepository.findByReviewableItemId(reviewableItemId).stream()
            .map(ReviewEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Review> findByStatus(ReviewStatus status) {
        return jpaRepository.findByStatus(status.name()).stream()
            .map(ReviewEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Review> findApprovedReviewByTypeAndReferenceId(ReviewableType type, Long referenceId) {
        return jpaRepository.findApprovedReviewByTypeAndReferenceId(type.name(), referenceId)
            .map(ReviewEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Review> findByTypeAndReferenceId(ReviewableType type, Long referenceId) {
        return jpaRepository.findByTypeAndReferenceId(type.name(), referenceId).stream()
            .map(ReviewEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Review save(Review review) {
        ReviewJpaEntity jpaEntity = ReviewEntityMapper.toJpa(review);
        ReviewJpaEntity saved = jpaRepository.save(jpaEntity);
        return ReviewEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Review review) {
        jpaRepository.deleteById(review.getId());
    }
}

