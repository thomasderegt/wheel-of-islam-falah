package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.GoalJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for GoalJpaEntity
 */
@Repository
public interface GoalJpaRepository extends JpaRepository<GoalJpaEntity, Long> {
    List<GoalJpaEntity> findByLifeDomainId(Long lifeDomainId);

    @Query("SELECT g FROM GoalJpaEntity g WHERE g.lifeDomainId = :lifeDomainId ORDER BY g.orderIndex ASC")
    List<GoalJpaEntity> findByLifeDomainIdOrderedByOrderIndex(@Param("lifeDomainId") Long lifeDomainId);
}
