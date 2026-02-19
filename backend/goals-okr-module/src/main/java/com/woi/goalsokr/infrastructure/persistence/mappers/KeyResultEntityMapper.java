package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultJpaEntity;

/**
 * Mapper between KeyResult domain entity and KeyResultJpaEntity
 */
public class KeyResultEntityMapper {

    public static KeyResult toDomain(KeyResultJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        KeyResult domain = new KeyResult();
        domain.setId(jpaEntity.getId());
        domain.setObjectiveId(jpaEntity.getObjectiveId());
        domain.setTitleNl(jpaEntity.getTitleNl());
        domain.setTitleEn(jpaEntity.getTitleEn());
        domain.setDescriptionNl(jpaEntity.getDescriptionNl());
        domain.setDescriptionEn(jpaEntity.getDescriptionEn());
        domain.setTargetValue(jpaEntity.getTargetValue());
        domain.setUnit(jpaEntity.getUnit());
        domain.setOrderIndex(jpaEntity.getOrderIndex());
        domain.setNumber(jpaEntity.getNumber());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());
        domain.setCreatedByUserId(jpaEntity.getCreatedByUserId());

        return domain;
    }

    public static KeyResultJpaEntity toJpa(KeyResult domain) {
        if (domain == null) {
            return null;
        }

        KeyResultJpaEntity jpaEntity = new KeyResultJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setObjectiveId(domain.getObjectiveId());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setDescriptionNl(domain.getDescriptionNl());
        jpaEntity.setDescriptionEn(domain.getDescriptionEn());
        jpaEntity.setTargetValue(domain.getTargetValue());
        jpaEntity.setUnit(domain.getUnit());
        jpaEntity.setOrderIndex(domain.getOrderIndex());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        jpaEntity.setCreatedByUserId(domain.getCreatedByUserId());

        return jpaEntity;
    }
}
