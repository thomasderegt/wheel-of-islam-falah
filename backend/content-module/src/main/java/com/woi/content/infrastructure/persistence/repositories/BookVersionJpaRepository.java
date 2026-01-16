package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.BookVersionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for BookVersionJpaEntity
 */
@Repository
public interface BookVersionJpaRepository extends JpaRepository<BookVersionJpaEntity, Long> {
    
    List<BookVersionJpaEntity> findByBookIdOrderByVersionNumberDesc(Long bookId);
    
    Optional<BookVersionJpaEntity> findByBookIdAndVersionNumber(Long bookId, Integer versionNumber);
    
    Optional<BookVersionJpaEntity> findFirstByBookIdOrderByVersionNumberDesc(Long bookId);
}

