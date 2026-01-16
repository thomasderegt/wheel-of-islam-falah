package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ContentStatusJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for ContentStatusJpaEntity
 */
@Repository
public interface ContentStatusJpaRepository extends JpaRepository<ContentStatusJpaEntity, Long> {
    
    Optional<ContentStatusJpaEntity> findByEntityTypeAndEntityId(String entityType, Long entityId);
}

