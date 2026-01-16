package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.ReviewComment;
import com.woi.content.infrastructure.persistence.entities.ReviewCommentJpaEntity;

/**
 * Mapper between ReviewComment domain entity and ReviewCommentJpaEntity
 */
public class ReviewCommentEntityMapper {
    
    public static ReviewComment toDomain(ReviewCommentJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        ReviewComment comment = new ReviewComment();
        comment.setId(jpaEntity.getId());
        comment.setReviewId(jpaEntity.getReviewId());
        comment.setReviewedVersionId(jpaEntity.getReviewedVersionId());
        comment.setFieldName(jpaEntity.getFieldName());
        comment.setCommentText(jpaEntity.getCommentText());
        comment.setCreatedBy(jpaEntity.getCreatedBy());
        comment.setCreatedAt(jpaEntity.getCreatedAt());
        comment.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return comment;
    }
    
    public static ReviewCommentJpaEntity toJpa(ReviewComment domain) {
        if (domain == null) {
            return null;
        }
        
        ReviewCommentJpaEntity jpaEntity = new ReviewCommentJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setReviewId(domain.getReviewId());
        jpaEntity.setReviewedVersionId(domain.getReviewedVersionId());
        jpaEntity.setFieldName(domain.getFieldName());
        jpaEntity.setCommentText(domain.getCommentText());
        jpaEntity.setCreatedBy(domain.getCreatedBy());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

