package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.domain.repositories.ReviewCommentRepository;
import com.woi.content.infrastructure.persistence.entities.ReviewCommentJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ReviewCommentEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for ReviewComment
 */
@Repository
public class ReviewCommentRepositoryImpl implements ReviewCommentRepository {
    
    private final ReviewCommentJpaRepository jpaRepository;
    
    public ReviewCommentRepositoryImpl(ReviewCommentJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ReviewComment> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ReviewCommentEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ReviewComment> findByReviewId(Long reviewId) {
        return jpaRepository.findByReviewId(reviewId).stream()
            .map(ReviewCommentEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public ReviewComment save(ReviewComment reviewComment) {
        ReviewCommentJpaEntity jpaEntity = ReviewCommentEntityMapper.toJpa(reviewComment);
        ReviewCommentJpaEntity saved = jpaRepository.save(jpaEntity);
        return ReviewCommentEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(ReviewComment reviewComment) {
        jpaRepository.deleteById(reviewComment.getId());
    }
    
    @Override
    @Transactional
    public void deleteByReviewId(Long reviewId) {
        jpaRepository.deleteByReviewId(reviewId);
    }
}

