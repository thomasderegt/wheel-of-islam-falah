package com.woi.learning.infrastructure.persistence.mappers;

import com.woi.learning.domain.entities.LearningFlowTemplate;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowTemplateJpaEntity;

/**
 * Mapper between LearningFlowTemplate domain entity and LearningFlowTemplateJpaEntity
 */
public class LearningFlowTemplateEntityMapper {
    
    public static LearningFlowTemplate toDomain(LearningFlowTemplateJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        LearningFlowTemplate template = new LearningFlowTemplate();
        template.setId(jpaEntity.getId());
        template.setName(jpaEntity.getName());
        template.setDescription(jpaEntity.getDescription());
        template.setSectionId(jpaEntity.getSectionId());
        template.setCreatedBy(jpaEntity.getCreatedBy());
        template.setCreatedAt(jpaEntity.getCreatedAt());
        
        return template;
    }
    
    public static LearningFlowTemplateJpaEntity toJpa(LearningFlowTemplate domain) {
        if (domain == null) {
            return null;
        }
        
        LearningFlowTemplateJpaEntity jpaEntity = new LearningFlowTemplateJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setName(domain.getName());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setSectionId(domain.getSectionId());
        jpaEntity.setCreatedBy(domain.getCreatedBy());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        return jpaEntity;
    }
}

