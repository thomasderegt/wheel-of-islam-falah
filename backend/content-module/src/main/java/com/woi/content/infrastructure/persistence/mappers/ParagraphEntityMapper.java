package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Paragraph;
import com.woi.content.infrastructure.persistence.entities.ParagraphJpaEntity;

/**
 * Mapper between Paragraph domain entity and ParagraphJpaEntity
 */
public class ParagraphEntityMapper {
    
    public static Paragraph toDomain(ParagraphJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Paragraph paragraph = new Paragraph();
        paragraph.setId(jpaEntity.getId());
        paragraph.setSectionId(jpaEntity.getSectionId());
        paragraph.setParagraphNumberInternal(jpaEntity.getParagraphNumber());
        paragraph.setWorkingStatusParagraphVersionId(jpaEntity.getWorkingStatusParagraphVersionId());
        paragraph.setCreatedAt(jpaEntity.getCreatedAt());
        paragraph.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return paragraph;
    }
    
    public static ParagraphJpaEntity toJpa(Paragraph domain) {
        if (domain == null) {
            return null;
        }
        
        ParagraphJpaEntity jpaEntity = new ParagraphJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setSectionId(domain.getSectionId());
        jpaEntity.setParagraphNumber(domain.getParagraphNumber());
        jpaEntity.setWorkingStatusParagraphVersionId(domain.getWorkingStatusParagraphVersionId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

