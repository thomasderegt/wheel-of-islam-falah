package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Chapter;
import com.woi.content.infrastructure.persistence.entities.ChapterJpaEntity;

/**
 * Mapper between Chapter domain entity and ChapterJpaEntity
 */
public class ChapterEntityMapper {
    
    public static Chapter toDomain(ChapterJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Chapter chapter = new Chapter();
        chapter.setId(jpaEntity.getId());
        chapter.setBookId(jpaEntity.getBookId());
        chapter.setChapterNumberInternal(jpaEntity.getChapterNumber());
        chapter.setPositionInternal(jpaEntity.getPosition());
        chapter.setWorkingStatusChapterVersionId(jpaEntity.getWorkingStatusChapterVersionId());
        chapter.setCreatedAt(jpaEntity.getCreatedAt());
        chapter.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return chapter;
    }
    
    public static ChapterJpaEntity toJpa(Chapter domain) {
        if (domain == null) {
            return null;
        }
        
        ChapterJpaEntity jpaEntity = new ChapterJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setBookId(domain.getBookId());
        jpaEntity.setChapterNumber(domain.getChapterNumber());
        jpaEntity.setPosition(domain.getPosition());
        jpaEntity.setWorkingStatusChapterVersionId(domain.getWorkingStatusChapterVersionId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

