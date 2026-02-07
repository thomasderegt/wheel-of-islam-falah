package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for UserObjectiveJpaEntity
 */
@Repository
public interface UserObjectiveJpaRepository extends JpaRepository<UserObjectiveJpaEntity, Long> {
    List<UserObjectiveJpaEntity> findByUserId(Long userId);
    List<UserObjectiveJpaEntity> findByUserGoalId(Long userGoalId);

    @Query("SELECT uo FROM UserObjectiveJpaEntity uo WHERE uo.userGoalId = :userGoalId ORDER BY uo.createdAt DESC")
    List<UserObjectiveJpaEntity> findByUserGoalIdOrderedByCreatedAtDesc(@Param("userGoalId") Long userGoalId);
}
