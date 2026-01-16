package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ParagraphVersionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for ParagraphVersionJpaEntity
 */
@Repository
public interface ParagraphVersionJpaRepository extends JpaRepository<ParagraphVersionJpaEntity, Long> {
    
    List<ParagraphVersionJpaEntity> findByParagraphIdOrderByVersionNumberDesc(Long paragraphId);
    
    Optional<ParagraphVersionJpaEntity> findByParagraphIdAndVersionNumber(Long paragraphId, Integer versionNumber);
    
    Optional<ParagraphVersionJpaEntity> findFirstByParagraphIdOrderByVersionNumberDesc(Long paragraphId);
}

