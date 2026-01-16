package com.woi.learning.infrastructure.persistence.mappers;

import com.woi.learning.domain.entities.LearningFlowEnrollment;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentJpaEntity;

/**
 * Mapper between LearningFlowEnrollment domain entity and LearningFlowEnrollmentJpaEntity
 */
public class LearningFlowEnrollmentEntityMapper {
    
    public static LearningFlowEnrollment toDomain(LearningFlowEnrollmentJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        LearningFlowEnrollment enrollment = new LearningFlowEnrollment();
        enrollment.setId(jpaEntity.getId());
        enrollment.setUserId(jpaEntity.getUserId());
        enrollment.setTemplateId(jpaEntity.getTemplateId());
        enrollment.setSectionId(jpaEntity.getSectionId());
        enrollment.setStartedAt(jpaEntity.getStartedAt());
        enrollment.setCompletedAt(jpaEntity.getCompletedAt());
        
        return enrollment;
    }
    
    public static LearningFlowEnrollmentJpaEntity toJpa(LearningFlowEnrollment domain) {
        if (domain == null) {
            return null;
        }
        
        LearningFlowEnrollmentJpaEntity jpaEntity = new LearningFlowEnrollmentJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setTemplateId(domain.getTemplateId());
        jpaEntity.setSectionId(domain.getSectionId());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());
        
        return jpaEntity;
    }
}

