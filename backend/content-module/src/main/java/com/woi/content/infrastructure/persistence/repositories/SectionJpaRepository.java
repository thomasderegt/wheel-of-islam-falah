package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.SectionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for SectionJpaEntity
 */
@Repository
public interface SectionJpaRepository extends JpaRepository<SectionJpaEntity, Long> {
    
    List<SectionJpaEntity> findByChapterIdOrderByOrderIndex(Long chapterId);
    
    boolean existsByChapterIdAndOrderIndex(Long chapterId, Integer orderIndex);
}

