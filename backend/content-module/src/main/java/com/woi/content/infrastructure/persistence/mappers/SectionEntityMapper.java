package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Section;
import com.woi.content.infrastructure.persistence.entities.SectionJpaEntity;

/**
 * Mapper between Section domain entity and SectionJpaEntity
 */
public class SectionEntityMapper {
    
    public static Section toDomain(SectionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Section section = new Section();
        section.setId(jpaEntity.getId());
        section.setChapterId(jpaEntity.getChapterId());
        section.setOrderIndex(jpaEntity.getOrderIndex());
        section.setWorkingStatusSectionVersionId(jpaEntity.getWorkingStatusSectionVersionId());
        section.setCreatedAt(jpaEntity.getCreatedAt());
        section.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return section;
    }
    
    public static SectionJpaEntity toJpa(Section domain) {
        if (domain == null) {
            return null;
        }
        
        SectionJpaEntity jpaEntity = new SectionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setChapterId(domain.getChapterId());
        jpaEntity.setOrderIndex(domain.getOrderIndex());
        jpaEntity.setWorkingStatusSectionVersionId(domain.getWorkingStatusSectionVersionId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

