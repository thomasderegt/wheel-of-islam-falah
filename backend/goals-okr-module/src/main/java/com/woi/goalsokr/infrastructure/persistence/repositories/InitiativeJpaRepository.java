package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for InitiativeJpaEntity
 */
@Repository
public interface InitiativeJpaRepository extends JpaRepository<InitiativeJpaEntity, Long> {
    
    // Query via userObjectiveInstanceId → userGoalInstanceId → userId
    @Query("SELECT i FROM InitiativeJpaEntity i " +
           "JOIN UserObjectiveInstanceJpaEntity uoi ON i.userObjectiveInstanceId = uoi.id " +
           "JOIN UserGoalInstanceJpaEntity ugi ON uoi.userGoalInstanceId = ugi.id " +
           "WHERE ugi.userId = :userId")
    List<InitiativeJpaEntity> findByUserId(@Param("userId") Long userId);
    
    List<InitiativeJpaEntity> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
    List<InitiativeJpaEntity> findByKeyResultId(Long keyResultId);
    
    // Query via userObjectiveInstanceId → userGoalInstanceId → userId AND keyResultId
    @Query("SELECT i FROM InitiativeJpaEntity i " +
           "JOIN UserObjectiveInstanceJpaEntity uoi ON i.userObjectiveInstanceId = uoi.id " +
           "JOIN UserGoalInstanceJpaEntity ugi ON uoi.userGoalInstanceId = ugi.id " +
           "WHERE ugi.userId = :userId AND i.keyResultId = :keyResultId")
    List<InitiativeJpaEntity> findByUserIdAndKeyResultId(
        @Param("userId") Long userId,
        @Param("keyResultId") Long keyResultId
    );
    
    // Query via userObjectiveInstanceId → userGoalInstanceId → userId AND status
    @Query("SELECT i FROM InitiativeJpaEntity i " +
           "JOIN UserObjectiveInstanceJpaEntity uoi ON i.userObjectiveInstanceId = uoi.id " +
           "JOIN UserGoalInstanceJpaEntity ugi ON uoi.userGoalInstanceId = ugi.id " +
           "WHERE ugi.userId = :userId AND i.status = :status")
    List<InitiativeJpaEntity> findByUserIdAndStatus(
        @Param("userId") Long userId,
        @Param("status") String status
    );
}
