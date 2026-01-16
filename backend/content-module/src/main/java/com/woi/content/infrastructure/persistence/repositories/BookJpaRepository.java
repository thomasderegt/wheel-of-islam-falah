package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.BookJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for BookJpaEntity
 */
@Repository
public interface BookJpaRepository extends JpaRepository<BookJpaEntity, Long> {
    
    List<BookJpaEntity> findByCategoryId(Long categoryId);
}

