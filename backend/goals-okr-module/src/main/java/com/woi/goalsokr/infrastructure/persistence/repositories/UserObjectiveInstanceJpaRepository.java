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

    List<UserObjectiveInstanceJpaEntity> findByUserId(Long userId);
    Optional<UserObjectiveInstanceJpaEntity> findByUserIdAndObjectiveId(Long userId, Long objectiveId);
    List<UserObjectiveInstanceJpaEntity> findByObjectiveId(Long objectiveId);
}
