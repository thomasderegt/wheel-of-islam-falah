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
        domain.setUserId(jpaEntity.getUserId());
        domain.setObjectiveId(jpaEntity.getObjectiveId());
        domain.setNumber(jpaEntity.getNumber());
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
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setObjectiveId(domain.getObjectiveId());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
