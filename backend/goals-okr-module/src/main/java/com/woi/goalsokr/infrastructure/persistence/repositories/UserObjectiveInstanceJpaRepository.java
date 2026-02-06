package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveInstanceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for UserObjectiveInstanceJpaEntity
 */
@Repository
public interface UserObjectiveInstanceJpaRepository extends JpaRepository<UserObjectiveInstanceJpaEntity, Long> {
    List<UserObjectiveInstanceJpaEntity> findByUserGoalInstanceId(Long userGoalInstanceId);
    List<UserObjectiveInstanceJpaEntity> findByUserGoalInstanceIdIn(List<Long> userGoalInstanceIds);
    Optional<UserObjectiveInstanceJpaEntity> findByUserGoalInstanceIdAndObjectiveId(Long userGoalInstanceId, Long objectiveId);
}
