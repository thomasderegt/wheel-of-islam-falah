package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.BookVersion;
import com.woi.content.infrastructure.persistence.entities.BookVersionJpaEntity;

/**
 * Mapper between BookVersion domain entity and BookVersionJpaEntity
 */
public class BookVersionEntityMapper {
    
    public static BookVersion toDomain(BookVersionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        BookVersion version = new BookVersion();
        version.setId(jpaEntity.getId());
        version.setBookId(jpaEntity.getBookId());
        version.setVersionNumber(jpaEntity.getVersionNumber());
        version.setTitleEn(jpaEntity.getTitleEn());
        version.setTitleNl(jpaEntity.getTitleNl());
        version.setIntroEn(jpaEntity.getIntroEn());
        version.setIntroNl(jpaEntity.getIntroNl());
        version.setCreatedBy(jpaEntity.getCreatedBy());
        version.setCreatedAt(jpaEntity.getCreatedAt());
        
        return version;
    }
    
    public static BookVersionJpaEntity toJpa(BookVersion domain) {
        if (domain == null) {
            return null;
        }
        
        BookVersionJpaEntity jpaEntity = new BookVersionJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setBookId(domain.getBookId());
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

