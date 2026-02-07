package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeInstanceJpaEntity;

/**
 * Mapper between UserInitiativeInstance domain entity and UserInitiativeInstanceJpaEntity
 */
public class UserInitiativeInstanceEntityMapper {

    public static UserInitiativeInstance toDomain(UserInitiativeInstanceJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserInitiativeInstance domain = new UserInitiativeInstance();
        domain.setId(jpaEntity.getId());
        domain.setUserKeyResultInstanceId(jpaEntity.getUserKeyResultInstanceId());
        domain.setInitiativeId(jpaEntity.getInitiativeId());
        domain.setStartedAt(jpaEntity.getStartedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserInitiativeInstanceJpaEntity toJpa(UserInitiativeInstance domain) {
        if (domain == null) {
            return null;
        }

        UserInitiativeInstanceJpaEntity jpaEntity = new UserInitiativeInstanceJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserKeyResultInstanceId(domain.getUserKeyResultInstanceId());
        jpaEntity.setInitiativeId(domain.getInitiativeId());
        jpaEntity.setStartedAt(domain.getStartedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
