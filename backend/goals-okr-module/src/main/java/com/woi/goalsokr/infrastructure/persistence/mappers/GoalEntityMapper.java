package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.Goal;
import com.woi.goalsokr.infrastructure.persistence.entities.GoalJpaEntity;

/**
 * Mapper between Goal domain entity and GoalJpaEntity
 */
public class GoalEntityMapper {

    public static Goal toDomain(GoalJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        Goal domain = new Goal();
        domain.setId(jpaEntity.getId());
        domain.setLifeDomainId(jpaEntity.getLifeDomainId());
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

    public static GoalJpaEntity toJpa(Goal domain) {
        if (domain == null) {
            return null;
        }

        GoalJpaEntity jpaEntity = new GoalJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setLifeDomainId(domain.getLifeDomainId());
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
