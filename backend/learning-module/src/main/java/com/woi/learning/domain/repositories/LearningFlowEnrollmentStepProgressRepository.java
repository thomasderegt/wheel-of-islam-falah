package com.woi.learning.domain.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;

import java.util.List;
import java.util.Optional;

/**
 * LearningFlowEnrollmentStepProgress repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface LearningFlowEnrollmentStepProgressRepository {
    Optional<LearningFlowEnrollmentStepProgress> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId);
    List<LearningFlowEnrollmentStepProgress> findByEnrollmentId(Long enrollmentId);
    LearningFlowEnrollmentStepProgress save(LearningFlowEnrollmentStepProgress progress);
    void delete(LearningFlowEnrollmentStepProgress progress);
}

