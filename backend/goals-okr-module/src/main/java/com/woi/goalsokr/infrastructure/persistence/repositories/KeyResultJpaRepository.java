package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for KeyResultJpaEntity
 */
@Repository
public interface KeyResultJpaRepository extends JpaRepository<KeyResultJpaEntity, Long> {
    List<KeyResultJpaEntity> findByObjectiveId(Long objectiveId);

    @Query("SELECT kr FROM KeyResultJpaEntity kr WHERE kr.objectiveId = :objectiveId ORDER BY kr.orderIndex ASC")
    List<KeyResultJpaEntity> findByObjectiveIdOrderedByOrderIndex(@Param("objectiveId") Long objectiveId);
}
