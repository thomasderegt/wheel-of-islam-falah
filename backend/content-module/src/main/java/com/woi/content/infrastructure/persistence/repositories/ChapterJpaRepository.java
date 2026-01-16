package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ChapterJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for ChapterJpaEntity
 */
@Repository
public interface ChapterJpaRepository extends JpaRepository<ChapterJpaEntity, Long> {
    
    List<ChapterJpaEntity> findByBookId(Long bookId);
}

