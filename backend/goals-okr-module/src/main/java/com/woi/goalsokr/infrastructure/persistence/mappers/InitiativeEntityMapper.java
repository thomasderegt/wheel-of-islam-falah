package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.enums.GoalStatus;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;

/**
 * Mapper between Initiative domain entity and InitiativeJpaEntity
 */
public class InitiativeEntityMapper {

    public static Initiative toDomain(InitiativeJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        Initiative domain = new Initiative();
        domain.setId(jpaEntity.getId());
        domain.setKeyResultId(jpaEntity.getKeyResultId());
        domain.setUserObjectiveInstanceId(jpaEntity.getUserObjectiveInstanceId());
        domain.setTitle(jpaEntity.getTitle());
        domain.setDescription(jpaEntity.getDescription());
        
        // Handle status mapping with null/empty check
        if (jpaEntity.getStatus() == null || jpaEntity.getStatus().trim().isEmpty()) {
            // Default to ACTIVE if status is null or empty
            domain.setStatus(GoalStatus.ACTIVE);
        } else {
            try {
                domain.setStatus(GoalStatus.valueOf(jpaEntity.getStatus()));
            } catch (IllegalArgumentException e) {
                // If status string doesn't match enum, default to ACTIVE
                domain.setStatus(GoalStatus.ACTIVE);
            }
        }
        
        domain.setTargetDate(jpaEntity.getTargetDate());
        domain.setLearningFlowEnrollmentId(jpaEntity.getLearningFlowEnrollmentId());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());

        return domain;
    }

    public static InitiativeJpaEntity toJpa(Initiative domain) {
        if (domain == null) {
            return null;
        }

        InitiativeJpaEntity jpaEntity = new InitiativeJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setUserObjectiveInstanceId(domain.getUserObjectiveInstanceId());
        jpaEntity.setTitle(domain.getTitle());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        jpaEntity.setTargetDate(domain.getTargetDate());
        jpaEntity.setLearningFlowEnrollmentId(domain.getLearningFlowEnrollmentId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());

        return jpaEntity;
    }
}
