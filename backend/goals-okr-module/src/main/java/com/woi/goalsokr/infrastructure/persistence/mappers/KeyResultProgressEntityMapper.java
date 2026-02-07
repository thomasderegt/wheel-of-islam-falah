package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.KeyResultProgress;
import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultProgressJpaEntity;

/**
 * Mapper between KeyResultProgress domain entity and KeyResultProgressJpaEntity
 */
public class KeyResultProgressEntityMapper {

    public static KeyResultProgress toDomain(KeyResultProgressJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        KeyResultProgress domain = new KeyResultProgress();
        domain.setId(jpaEntity.getId());
        domain.setKeyResultId(jpaEntity.getKeyResultId());
        domain.setUserKeyResultInstanceId(jpaEntity.getUserKeyResultInstanceId());
        domain.setCurrentValue(jpaEntity.getCurrentValue());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());

        return domain;
    }

    public static KeyResultProgressJpaEntity toJpa(KeyResultProgress domain) {
        if (domain == null) {
            return null;
        }

        KeyResultProgressJpaEntity jpaEntity = new KeyResultProgressJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setUserKeyResultInstanceId(domain.getUserKeyResultInstanceId());
        jpaEntity.setCurrentValue(domain.getCurrentValue());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());

        return jpaEntity;
    }
}
