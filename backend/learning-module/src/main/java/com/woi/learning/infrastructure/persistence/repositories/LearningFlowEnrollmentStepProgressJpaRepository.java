package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentStepProgressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for LearningFlowEnrollmentStepProgressJpaEntity
 */
@Repository
public interface LearningFlowEnrollmentStepProgressJpaRepository extends JpaRepository<LearningFlowEnrollmentStepProgressJpaEntity, Long> {
    Optional<LearningFlowEnrollmentStepProgressJpaEntity> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId);
    List<LearningFlowEnrollmentStepProgressJpaEntity> findByEnrollmentId(Long enrollmentId);
}

