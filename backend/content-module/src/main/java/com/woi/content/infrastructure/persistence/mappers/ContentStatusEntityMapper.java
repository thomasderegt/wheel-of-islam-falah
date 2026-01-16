package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.infrastructure.persistence.entities.ContentStatusJpaEntity;

/**
 * Mapper between ContentStatus domain entity and ContentStatusJpaEntity
 */
public class ContentStatusEntityMapper {
    
    public static ContentStatus toDomain(ContentStatusJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        ContentStatus contentStatus = new ContentStatus();
        contentStatus.setId(jpaEntity.getId());
        contentStatus.setCreatedAt(jpaEntity.getCreatedAt());
        contentStatus.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        // Use setters for business fields (we need to add them to ContentStatus)
        contentStatus.setEntityType(jpaEntity.getEntityType());
        contentStatus.setEntityId(jpaEntity.getEntityId());
        contentStatus.setStatus(ContentStatusType.valueOf(jpaEntity.getStatus()));
        contentStatus.setUserId(jpaEntity.getUserId());
        
        return contentStatus;
    }
    
    public static ContentStatusJpaEntity toJpa(ContentStatus domain) {
        if (domain == null) {
            return null;
        }
        
        ContentStatusJpaEntity jpaEntity = new ContentStatusJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setEntityType(domain.getEntityType());
        jpaEntity.setEntityId(domain.getEntityId());
        jpaEntity.setStatus(domain.getStatus().name());  // Convert enum to string
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

