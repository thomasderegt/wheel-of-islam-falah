package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserGoal;
import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalJpaEntity;

/**
 * Mapper between UserGoal domain entity and UserGoalJpaEntity
 */
public class UserGoalEntityMapper {

    public static UserGoal toDomain(UserGoalJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserGoal domain = new UserGoal();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setLifeDomainId(jpaEntity.getLifeDomainId());
        domain.setTitle(jpaEntity.getTitle());
        domain.setDescription(jpaEntity.getDescription());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserGoalJpaEntity toJpa(UserGoal domain) {
        if (domain == null) {
            return null;
        }

        UserGoalJpaEntity jpaEntity = new UserGoalJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setLifeDomainId(domain.getLifeDomainId());
        jpaEntity.setTitle(domain.getTitle());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
