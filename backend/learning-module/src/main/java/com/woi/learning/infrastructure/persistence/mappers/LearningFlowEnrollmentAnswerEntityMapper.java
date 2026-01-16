package com.woi.learning.infrastructure.persistence.mappers;

import com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer;
import com.woi.learning.domain.enums.AnswerType;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentAnswerJpaEntity;

/**
 * Mapper between LearningFlowEnrollmentAnswer domain entity and LearningFlowEnrollmentAnswerJpaEntity
 */
public class LearningFlowEnrollmentAnswerEntityMapper {
    
    public static LearningFlowEnrollmentAnswer toDomain(LearningFlowEnrollmentAnswerJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        LearningFlowEnrollmentAnswer answer = new LearningFlowEnrollmentAnswer();
        answer.setId(jpaEntity.getId());
        answer.setEnrollmentId(jpaEntity.getEnrollmentId());
        answer.setStepId(jpaEntity.getStepId());
        answer.setType(jpaEntity.getAnswerType());
        answer.setAnswerText(jpaEntity.getAnswerText());
        answer.setCreatedAt(jpaEntity.getCreatedAt());
        
        return answer;
    }
    
    public static LearningFlowEnrollmentAnswerJpaEntity toJpa(LearningFlowEnrollmentAnswer domain) {
        if (domain == null) {
            return null;
        }
        
        LearningFlowEnrollmentAnswerJpaEntity jpaEntity = new LearningFlowEnrollmentAnswerJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setEnrollmentId(domain.getEnrollmentId());
        jpaEntity.setStepId(domain.getStepId());
        jpaEntity.setAnswerType(domain.getType());
        jpaEntity.setAnswerText(domain.getAnswerText());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        return jpaEntity;
    }
}

