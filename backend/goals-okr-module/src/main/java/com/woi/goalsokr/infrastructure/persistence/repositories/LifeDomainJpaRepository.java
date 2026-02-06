package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.LifeDomainJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for LifeDomainJpaEntity
 */
@Repository
public interface LifeDomainJpaRepository extends JpaRepository<LifeDomainJpaEntity, Long> {
    
    /**
     * Find all life domains ordered by display order
     */
    List<LifeDomainJpaEntity> findAllByOrderByDisplayOrderAsc();
}
