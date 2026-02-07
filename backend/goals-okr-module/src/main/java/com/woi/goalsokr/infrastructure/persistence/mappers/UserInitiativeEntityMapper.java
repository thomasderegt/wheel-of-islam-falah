package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.enums.GoalStatus;
import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeJpaEntity;

/**
 * Mapper between UserInitiative domain entity and UserInitiativeJpaEntity
 */
public class UserInitiativeEntityMapper {

    public static UserInitiative toDomain(UserInitiativeJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserInitiative domain = new UserInitiative();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setUserKeyResultInstanceId(jpaEntity.getUserKeyResultInstanceId());
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
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserInitiativeJpaEntity toJpa(UserInitiative domain) {
        if (domain == null) {
            return null;
        }

        UserInitiativeJpaEntity jpaEntity = new UserInitiativeJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setUserKeyResultInstanceId(domain.getUserKeyResultInstanceId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setTitle(domain.getTitle());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        jpaEntity.setTargetDate(domain.getTargetDate());
        jpaEntity.setLearningFlowEnrollmentId(domain.getLearningFlowEnrollmentId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
