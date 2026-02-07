package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.WheelJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for WheelJpaEntity
 */
@Repository
public interface WheelJpaRepository extends JpaRepository<WheelJpaEntity, Long> {
    
    /**
     * Find all wheels ordered by display order
     */
    List<WheelJpaEntity> findAllByOrderByDisplayOrderAsc();
    
    /**
     * Find a wheel by wheel key
     */
    Optional<WheelJpaEntity> findByWheelKey(String wheelKey);
}
