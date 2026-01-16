package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.ChapterVersion;
import com.woi.content.infrastructure.persistence.entities.ChapterVersionJpaEntity;

/**
 * Mapper between ChapterVersion domain entity and ChapterVersionJpaEntity
 */
public class ChapterVersionEntityMapper {
    
    public static ChapterVersion toDomain(ChapterVersionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        ChapterVersion version = new ChapterVersion();
        version.setId(jpaEntity.getId());
        version.setChapterId(jpaEntity.getChapterId());
        version.setVersionNumber(jpaEntity.getVersionNumber());
        version.setTitleEn(jpaEntity.getTitleEn());
        version.setTitleNl(jpaEntity.getTitleNl());
        version.setIntroEn(jpaEntity.getIntroEn());
        version.setIntroNl(jpaEntity.getIntroNl());
        version.setCreatedBy(jpaEntity.getCreatedBy());
        version.setCreatedAt(jpaEntity.getCreatedAt());
        
        return version;
    }
    
    public static ChapterVersionJpaEntity toJpa(ChapterVersion domain) {
        if (domain == null) {
            return null;
        }
        
        ChapterVersionJpaEntity jpaEntity = new ChapterVersionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setChapterId(domain.getChapterId());
        jpaEntity.setVersionNumber(domain.getVersionNumber());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setIntroEn(domain.getIntroEn());
        jpaEntity.setIntroNl(domain.getIntroNl());
        jpaEntity.setCreatedBy(domain.getCreatedBy());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        return jpaEntity;
    }
}

