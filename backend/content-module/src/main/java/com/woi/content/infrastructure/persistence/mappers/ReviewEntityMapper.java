package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Review;
import com.woi.content.domain.enums.ReviewStatus;
import com.woi.content.infrastructure.persistence.entities.ReviewJpaEntity;

/**
 * Mapper between Review domain entity and ReviewJpaEntity
 */
public class ReviewEntityMapper {
    
    public static Review toDomain(ReviewJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Review review = new Review();
        review.setId(jpaEntity.getId());
        review.setReviewableItemId(jpaEntity.getReviewableItemId());
        review.setReviewedVersionId(jpaEntity.getReviewedVersionId());
        review.setStatus(ReviewStatus.valueOf(jpaEntity.getStatus()));
        review.setComment(jpaEntity.getComment());
        review.setSubmittedBy(jpaEntity.getSubmittedBy());
        review.setReviewedBy(jpaEntity.getReviewedBy());
        review.setCreatedAt(jpaEntity.getCreatedAt());
        review.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return review;
    }
    
    public static ReviewJpaEntity toJpa(Review domain) {
        if (domain == null) {
            return null;
        }
        
        ReviewJpaEntity jpaEntity = new ReviewJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setReviewableItemId(domain.getReviewableItemId());
        jpaEntity.setReviewedVersionId(domain.getReviewedVersionId());
        jpaEntity.setStatus(domain.getStatus().name());
        jpaEntity.setComment(domain.getComment());
        jpaEntity.setSubmittedBy(domain.getSubmittedBy());
        jpaEntity.setReviewedBy(domain.getReviewedBy());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

