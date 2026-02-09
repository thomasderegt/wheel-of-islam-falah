package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;

/**
 * Mapper between Initiative domain entity (template) and InitiativeJpaEntity
 */
public class InitiativeEntityMapper {

    public static Initiative toDomain(InitiativeJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        Initiative domain = new Initiative();
        domain.setId(jpaEntity.getId());
        domain.setKeyResultId(jpaEntity.getKeyResultId());
        domain.setTitleNl(jpaEntity.getTitleNl());
        domain.setTitleEn(jpaEntity.getTitleEn());
        domain.setDescriptionNl(jpaEntity.getDescriptionNl());
        domain.setDescriptionEn(jpaEntity.getDescriptionEn());
        domain.setLearningFlowTemplateId(jpaEntity.getLearningFlowTemplateId());
        domain.setDisplayOrder(jpaEntity.getDisplayOrder());
        domain.setNumber(jpaEntity.getNumber());
        domain.setCreatedAt(jpaEntity.getCreatedAt());

        return domain;
    }

    public static InitiativeJpaEntity toJpa(Initiative domain) {
        if (domain == null) {
            return null;
        }

        InitiativeJpaEntity jpaEntity = new InitiativeJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setDescriptionNl(domain.getDescriptionNl());
        jpaEntity.setDescriptionEn(domain.getDescriptionEn());
        jpaEntity.setLearningFlowTemplateId(domain.getLearningFlowTemplateId());
        jpaEntity.setDisplayOrder(domain.getDisplayOrder());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());

        return jpaEntity;
    }
}
