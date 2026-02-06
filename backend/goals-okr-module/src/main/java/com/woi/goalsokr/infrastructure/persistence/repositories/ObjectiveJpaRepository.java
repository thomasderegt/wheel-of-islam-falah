package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.ObjectiveJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for ObjectiveJpaEntity
 */
@Repository
public interface ObjectiveJpaRepository extends JpaRepository<ObjectiveJpaEntity, Long> {
    List<ObjectiveJpaEntity> findByGoalId(Long goalId);

    @Query("SELECT o FROM ObjectiveJpaEntity o WHERE o.goalId = :goalId ORDER BY o.orderIndex ASC")
    List<ObjectiveJpaEntity> findByGoalIdOrderedByOrderIndex(@Param("goalId") Long goalId);
}
