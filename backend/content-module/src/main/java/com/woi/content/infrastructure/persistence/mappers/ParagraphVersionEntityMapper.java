package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.ParagraphVersion;
import com.woi.content.infrastructure.persistence.entities.ParagraphVersionJpaEntity;

/**
 * Mapper between ParagraphVersion domain entity and ParagraphVersionJpaEntity
 */
public class ParagraphVersionEntityMapper {
    
    public static ParagraphVersion toDomain(ParagraphVersionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        ParagraphVersion version = new ParagraphVersion();
        version.setId(jpaEntity.getId());
        version.setParagraphId(jpaEntity.getParagraphId());
        version.setVersionNumber(jpaEntity.getVersionNumber());
        version.setTitleEn(jpaEntity.getTitleEn());
        version.setTitleNl(jpaEntity.getTitleNl());
        version.setContentEn(jpaEntity.getContentEn());
        version.setContentNl(jpaEntity.getContentNl());
        version.setCreatedBy(jpaEntity.getCreatedBy());
        version.setCreatedAt(jpaEntity.getCreatedAt());
        
        return version;
    }
    
    public static ParagraphVersionJpaEntity toJpa(ParagraphVersion domain) {
        if (domain == null) {
            return null;
        }
        
        ParagraphVersionJpaEntity jpaEntity = new ParagraphVersionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setParagraphId(domain.getParagraphId());
        jpaEntity.setVersionNumber(domain.getVersionNumber());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setContentEn(domain.getContentEn());
        jpaEntity.setContentNl(domain.getContentNl());
        jpaEntity.setCreatedBy(domain.getCreatedBy());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        return jpaEntity;
    }
}

