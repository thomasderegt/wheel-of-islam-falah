package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserObjective;
import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveJpaEntity;

/**
 * Mapper between UserObjective domain entity and UserObjectiveJpaEntity
 */
public class UserObjectiveEntityMapper {

    public static UserObjective toDomain(UserObjectiveJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserObjective domain = new UserObjective();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setUserGoalId(jpaEntity.getUserGoalId());
        domain.setTitle(jpaEntity.getTitle());
        domain.setDescription(jpaEntity.getDescription());
        domain.setNumber(jpaEntity.getNumber());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserObjectiveJpaEntity toJpa(UserObjective domain) {
        if (domain == null) {
            return null;
        }

        UserObjectiveJpaEntity jpaEntity = new UserObjectiveJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setUserGoalId(domain.getUserGoalId());
        jpaEntity.setTitle(domain.getTitle());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
