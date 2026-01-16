package com.woi.learning.infrastructure.persistence.mappers;

import com.woi.learning.domain.entities.LearningFlowStep;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowStepJpaEntity;

/**
 * Mapper between LearningFlowStep domain entity and LearningFlowStepJpaEntity
 */
public class LearningFlowStepEntityMapper {
    
    public static LearningFlowStep toDomain(LearningFlowStepJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        LearningFlowStep step = new LearningFlowStep();
        step.setId(jpaEntity.getId());
        step.setTemplateId(jpaEntity.getTemplateId());
        step.setParagraphId(jpaEntity.getParagraphId());
        step.setOrderIndex(jpaEntity.getOrderIndex());
        step.setQuestionText(jpaEntity.getQuestionText());
        
        return step;
    }
    
    public static LearningFlowStepJpaEntity toJpa(LearningFlowStep domain) {
        if (domain == null) {
            return null;
        }
        
        LearningFlowStepJpaEntity jpaEntity = new LearningFlowStepJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setTemplateId(domain.getTemplateId());
        jpaEntity.setParagraphId(domain.getParagraphId());
        jpaEntity.setOrderIndex(domain.getOrderIndex());
        jpaEntity.setQuestionText(domain.getQuestionText());
        
        return jpaEntity;
    }
}

