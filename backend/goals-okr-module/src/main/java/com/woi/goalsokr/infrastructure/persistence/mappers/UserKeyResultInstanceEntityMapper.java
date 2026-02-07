package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultInstanceJpaEntity;

/**
 * Mapper between UserKeyResultInstance domain entity and UserKeyResultInstanceJpaEntity
 */
public class UserKeyResultInstanceEntityMapper {

    public static UserKeyResultInstance toDomain(UserKeyResultInstanceJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserKeyResultInstance domain = new UserKeyResultInstance();
        domain.setId(jpaEntity.getId());
        domain.setUserObjectiveInstanceId(jpaEntity.getUserObjectiveInstanceId());
        domain.setKeyResultId(jpaEntity.getKeyResultId());
        domain.setStartedAt(jpaEntity.getStartedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserKeyResultInstanceJpaEntity toJpa(UserKeyResultInstance domain) {
        if (domain == null) {
            return null;
        }

        UserKeyResultInstanceJpaEntity jpaEntity = new UserKeyResultInstanceJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserObjectiveInstanceId(domain.getUserObjectiveInstanceId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
