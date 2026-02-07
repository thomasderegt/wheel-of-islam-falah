package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.UserKeyResult;
import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultJpaEntity;

/**
 * Mapper between UserKeyResult domain entity and UserKeyResultJpaEntity
 */
public class UserKeyResultEntityMapper {

    public static UserKeyResult toDomain(UserKeyResultJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        UserKeyResult domain = new UserKeyResult();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setUserObjectiveId(jpaEntity.getUserObjectiveId());
        domain.setTitle(jpaEntity.getTitle());
        domain.setDescription(jpaEntity.getDescription());
        domain.setTargetValue(jpaEntity.getTargetValue());
        domain.setUnit(jpaEntity.getUnit());
        domain.setCurrentValue(jpaEntity.getCurrentValue());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());
        domain.setCompletedAt(jpaEntity.getCompletedAt());

        return domain;
    }

    public static UserKeyResultJpaEntity toJpa(UserKeyResult domain) {
        if (domain == null) {
            return null;
        }

        UserKeyResultJpaEntity jpaEntity = new UserKeyResultJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setUserObjectiveId(domain.getUserObjectiveId());
        jpaEntity.setTitle(domain.getTitle());
        jpaEntity.setDescription(domain.getDescription());
        jpaEntity.setTargetValue(domain.getTargetValue());
        jpaEntity.setUnit(domain.getUnit());
        jpaEntity.setCurrentValue(domain.getCurrentValue());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        jpaEntity.setCompletedAt(domain.getCompletedAt());

        return jpaEntity;
    }
}
