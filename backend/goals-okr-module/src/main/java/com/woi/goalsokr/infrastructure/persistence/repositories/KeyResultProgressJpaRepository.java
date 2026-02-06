package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultProgressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for KeyResultProgressJpaEntity
 */
@Repository
public interface KeyResultProgressJpaRepository extends JpaRepository<KeyResultProgressJpaEntity, Long> {
    List<KeyResultProgressJpaEntity> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
    List<KeyResultProgressJpaEntity> findByKeyResultId(Long keyResultId);
}
