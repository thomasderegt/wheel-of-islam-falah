package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.InitiativeSuggestion;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeSuggestionJpaEntity;

/**
 * Mapper between InitiativeSuggestion domain entity and InitiativeSuggestionJpaEntity
 */
public class InitiativeSuggestionEntityMapper {

    public static InitiativeSuggestion toDomain(InitiativeSuggestionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        InitiativeSuggestion domain = new InitiativeSuggestion();
        domain.setId(jpaEntity.getId());
        domain.setKeyResultId(jpaEntity.getKeyResultId());
        domain.setTitleNl(jpaEntity.getTitleNl());
        domain.setTitleEn(jpaEntity.getTitleEn());
        domain.setDescriptionNl(jpaEntity.getDescriptionNl());
        domain.setDescriptionEn(jpaEntity.getDescriptionEn());
        domain.setLearningFlowTemplateId(jpaEntity.getLearningFlowTemplateId());
        domain.setDisplayOrder(jpaEntity.getDisplayOrder());
        domain.setCreatedAt(jpaEntity.getCreatedAt());

        return domain;
    }

    public static InitiativeSuggestionJpaEntity toJpa(InitiativeSuggestion domain) {
        if (domain == null) {
            return null;
        }

        InitiativeSuggestionJpaEntity jpaEntity = new InitiativeSuggestionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setKeyResultId(domain.getKeyResultId());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setDescriptionNl(domain.getDescriptionNl());
        jpaEntity.setDescriptionEn(domain.getDescriptionEn());
        jpaEntity.setLearningFlowTemplateId(domain.getLearningFlowTemplateId());
        jpaEntity.setDisplayOrder(domain.getDisplayOrder());
        jpaEntity.setCreatedAt(domain.getCreatedAt());

        return jpaEntity;
    }
}
