package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for UserGoalJpaEntity
 */
@Repository
public interface UserGoalJpaRepository extends JpaRepository<UserGoalJpaEntity, Long> {
    List<UserGoalJpaEntity> findByUserId(Long userId);

    @Query("SELECT ug FROM UserGoalJpaEntity ug WHERE ug.userId = :userId ORDER BY ug.createdAt DESC")
    List<UserGoalJpaEntity> findByUserIdOrderedByCreatedAtDesc(@Param("userId") Long userId);

    List<UserGoalJpaEntity> findByUserIdAndLifeDomainId(Long userId, Long lifeDomainId);
}
