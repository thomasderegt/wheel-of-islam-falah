package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.ReviewableItem;
import com.woi.content.domain.enums.ReviewableType;
import com.woi.content.infrastructure.persistence.entities.ReviewableItemJpaEntity;

/**
 * Mapper between ReviewableItem domain entity and ReviewableItemJpaEntity
 */
public class ReviewableItemEntityMapper {
    
    public static ReviewableItem toDomain(ReviewableItemJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        ReviewableItem item = new ReviewableItem();
        item.setId(jpaEntity.getId());
        item.setType(ReviewableType.valueOf(jpaEntity.getType()));
        item.setReferenceId(jpaEntity.getReferenceId());
        item.setCreatedAt(jpaEntity.getCreatedAt());
        
        return item;
    }
    
    public static ReviewableItemJpaEntity toJpa(ReviewableItem domain) {
        if (domain == null) {
            return null;
        }
        
        ReviewableItemJpaEntity jpaEntity = new ReviewableItemJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setType(domain.getType().name());
        jpaEntity.setReferenceId(domain.getReferenceId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        return jpaEntity;
    }
}

