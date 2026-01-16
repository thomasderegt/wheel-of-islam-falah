package com.woi.learning.infrastructure.persistence.mappers;

import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.enums.ProgressStatus;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentStepProgressJpaEntity;

/**
 * Mapper between LearningFlowEnrollmentStepProgress domain entity and LearningFlowEnrollmentStepProgressJpaEntity
 */
public class LearningFlowEnrollmentStepProgressEntityMapper {
    
    public static LearningFlowEnrollmentStepProgress toDomain(LearningFlowEnrollmentStepProgressJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        LearningFlowEnrollmentStepProgress progress = new LearningFlowEnrollmentStepProgress();
        progress.setId(jpaEntity.getId());
        progress.setEnrollmentId(jpaEntity.getEnrollmentId());
        progress.setStepId(jpaEntity.getStepId());
        progress.setStatus(jpaEntity.getStatus());
        progress.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return progress;
    }
    
    public static LearningFlowEnrollmentStepProgressJpaEntity toJpa(LearningFlowEnrollmentStepProgress domain) {
        if (domain == null) {
            return null;
        }
        
        LearningFlowEnrollmentStepProgressJpaEntity jpaEntity = new LearningFlowEnrollmentStepProgressJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setEnrollmentId(domain.getEnrollmentId());
        jpaEntity.setStepId(domain.getStepId());
        jpaEntity.setStatus(domain.getStatus());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

