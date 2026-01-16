package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ChapterVersionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for ChapterVersionJpaEntity
 */
@Repository
public interface ChapterVersionJpaRepository extends JpaRepository<ChapterVersionJpaEntity, Long> {
    
    List<ChapterVersionJpaEntity> findByChapterIdOrderByVersionNumberDesc(Long chapterId);
    
    Optional<ChapterVersionJpaEntity> findByChapterIdAndVersionNumber(Long chapterId, Integer versionNumber);
    
    Optional<ChapterVersionJpaEntity> findFirstByChapterIdOrderByVersionNumberDesc(Long chapterId);
}

