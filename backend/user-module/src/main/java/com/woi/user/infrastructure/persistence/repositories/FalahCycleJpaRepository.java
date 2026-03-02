package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.FalahCycleJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for FalahCycleJpaEntity
 */
@Repository
public interface FalahCycleJpaRepository extends JpaRepository<FalahCycleJpaEntity, Long> {
    List<FalahCycleJpaEntity> findByUserIdOrderByStartedAtDesc(Long userId);
    List<FalahCycleJpaEntity> findByUserIdAndCompletedAtIsNullOrderByStartedAtDesc(Long userId);
}
