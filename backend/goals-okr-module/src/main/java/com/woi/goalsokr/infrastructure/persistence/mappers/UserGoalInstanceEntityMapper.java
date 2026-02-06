package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserGoalInstance;
import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalInstanceJpaEntity;

/**
 * Mapper between UserGoalInstance domain entity and UserGoalInstanceJpaEntity
 */
public class UserGoalInstanceEntityMapper {

    public static UserGoalInstance toDomain(UserGoalInstanceJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserGoalInstance domain = new UserGoalInstance();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setGoalId(jpaEntity.getGoalId());
        domain.setStartedAt(jpaEntity.getStartedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserGoalInstanceJpaEntity toJpa(UserGoalInstance domain) {
        if (domain == null) {
            return null;
        }

        UserGoalInstanceJpaEntity jpaEntity = new UserGoalInstanceJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setGoalId(domain.getGoalId());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
