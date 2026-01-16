package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ReviewableItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for ReviewableItemJpaEntity
 */
@Repository
public interface ReviewableItemJpaRepository extends JpaRepository<ReviewableItemJpaEntity, Long> {
    
    Optional<ReviewableItemJpaEntity> findByTypeAndReferenceId(String type, Long referenceId);
}

