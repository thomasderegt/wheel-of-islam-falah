package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.SectionVersion;
import com.woi.content.infrastructure.persistence.entities.SectionVersionJpaEntity;

/**
 * Mapper between SectionVersion domain entity and SectionVersionJpaEntity
 */
public class SectionVersionEntityMapper {
    
    public static SectionVersion toDomain(SectionVersionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        SectionVersion version = new SectionVersion();
        version.setId(jpaEntity.getId());
        version.setSectionId(jpaEntity.getSectionId());
        version.setVersionNumber(jpaEntity.getVersionNumber());
        version.setTitleEn(jpaEntity.getTitleEn());
        version.setTitleNl(jpaEntity.getTitleNl());
        version.setIntroEn(jpaEntity.getIntroEn());
        version.setIntroNl(jpaEntity.getIntroNl());
        version.setCreatedBy(jpaEntity.getCreatedBy());
        version.setCreatedAt(jpaEntity.getCreatedAt());
        
        return version;
    }
    
    public static SectionVersionJpaEntity toJpa(SectionVersion domain) {
        if (domain == null) {
            return null;
        }
        
        SectionVersionJpaEntity jpaEntity = new SectionVersionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setSectionId(domain.getSectionId());
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

