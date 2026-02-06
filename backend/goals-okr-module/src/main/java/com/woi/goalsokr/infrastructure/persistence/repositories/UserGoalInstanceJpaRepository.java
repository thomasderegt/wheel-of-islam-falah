package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalInstanceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for UserGoalInstanceJpaEntity
 */
@Repository
public interface UserGoalInstanceJpaRepository extends JpaRepository<UserGoalInstanceJpaEntity, Long> {
    List<UserGoalInstanceJpaEntity> findByUserId(Long userId);
    List<UserGoalInstanceJpaEntity> findByGoalId(Long goalId); // Which users are subscribed to this goal?
    Optional<UserGoalInstanceJpaEntity> findByUserIdAndGoalId(Long userId, Long goalId);
}
