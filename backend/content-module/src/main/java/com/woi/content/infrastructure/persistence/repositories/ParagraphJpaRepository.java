package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ParagraphJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for ParagraphJpaEntity
 */
@Repository
public interface ParagraphJpaRepository extends JpaRepository<ParagraphJpaEntity, Long> {
    
    List<ParagraphJpaEntity> findBySectionId(Long sectionId);
}

