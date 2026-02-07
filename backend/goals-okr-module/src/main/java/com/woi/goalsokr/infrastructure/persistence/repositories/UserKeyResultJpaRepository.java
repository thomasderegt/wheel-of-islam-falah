package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for UserKeyResultJpaEntity
 */
@Repository
public interface UserKeyResultJpaRepository extends JpaRepository<UserKeyResultJpaEntity, Long> {
    List<UserKeyResultJpaEntity> findByUserId(Long userId);
    List<UserKeyResultJpaEntity> findByUserObjectiveId(Long userObjectiveId);

    @Query("SELECT ukr FROM UserKeyResultJpaEntity ukr WHERE ukr.userObjectiveId = :userObjectiveId ORDER BY ukr.createdAt DESC")
    List<UserKeyResultJpaEntity> findByUserObjectiveIdOrderedByCreatedAtDesc(@Param("userObjectiveId") Long userObjectiveId);
}
