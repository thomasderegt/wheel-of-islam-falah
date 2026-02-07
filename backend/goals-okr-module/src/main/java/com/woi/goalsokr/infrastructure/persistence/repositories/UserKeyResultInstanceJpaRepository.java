package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultInstanceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for UserKeyResultInstanceJpaEntity
 */
@Repository
public interface UserKeyResultInstanceJpaRepository extends JpaRepository<UserKeyResultInstanceJpaEntity, Long> {
    List<UserKeyResultInstanceJpaEntity> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
    List<UserKeyResultInstanceJpaEntity> findByUserObjectiveInstanceIdIn(List<Long> userObjectiveInstanceIds);
    Optional<UserKeyResultInstanceJpaEntity> findByUserObjectiveInstanceIdAndKeyResultId(Long userObjectiveInstanceId, Long keyResultId);
}
