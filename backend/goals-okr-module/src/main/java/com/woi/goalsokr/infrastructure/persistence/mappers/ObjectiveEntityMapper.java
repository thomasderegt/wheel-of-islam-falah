package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.Objective;
import com.woi.goalsokr.infrastructure.persistence.entities.ObjectiveJpaEntity;

/**
 * Mapper between Objective domain entity and ObjectiveJpaEntity
 */
public class ObjectiveEntityMapper {

    public static Objective toDomain(ObjectiveJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        Objective domain = new Objective();
        domain.setId(jpaEntity.getId());
        domain.setGoalId(jpaEntity.getGoalId());
        domain.setTitleNl(jpaEntity.getTitleNl());
        domain.setTitleEn(jpaEntity.getTitleEn());
        domain.setDescriptionNl(jpaEntity.getDescriptionNl());
        domain.setDescriptionEn(jpaEntity.getDescriptionEn());
        domain.setOrderIndex(jpaEntity.getOrderIndex());
        domain.setNumber(jpaEntity.getNumber());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());

        return domain;
    }

    public static ObjectiveJpaEntity toJpa(Objective domain) {
        if (domain == null) {
            return null;
        }

        ObjectiveJpaEntity jpaEntity = new ObjectiveJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setGoalId(domain.getGoalId());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setDescriptionNl(domain.getDescriptionNl());
        jpaEntity.setDescriptionEn(domain.getDescriptionEn());
        jpaEntity.setOrderIndex(domain.getOrderIndex());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());

        return jpaEntity;
    }
}
