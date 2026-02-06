package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveInstanceJpaEntity;

/**
 * Mapper between UserObjectiveInstance domain entity and UserObjectiveInstanceJpaEntity
 */
public class UserObjectiveInstanceEntityMapper {

    public static UserObjectiveInstance toDomain(UserObjectiveInstanceJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserObjectiveInstance domain = new UserObjectiveInstance();
        domain.setId(jpaEntity.getId());
        domain.setUserGoalInstanceId(jpaEntity.getUserGoalInstanceId());
        domain.setObjectiveId(jpaEntity.getObjectiveId());
        domain.setStartedAt(jpaEntity.getStartedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserObjectiveInstanceJpaEntity toJpa(UserObjectiveInstance domain) {
        if (domain == null) {
            return null;
        }

        UserObjectiveInstanceJpaEntity jpaEntity = new UserObjectiveInstanceJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserGoalInstanceId(domain.getUserGoalInstanceId());
        jpaEntity.setObjectiveId(domain.getObjectiveId());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
