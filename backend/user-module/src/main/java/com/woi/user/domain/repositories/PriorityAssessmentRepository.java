package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.PriorityAssessment;

import java.util.Optional;

/**
 * PriorityAssessment repository interface - Domain layer
 */
public interface PriorityAssessmentRepository {
    Optional<PriorityAssessment> findByUserIdAndFalahCycleId(Long userId, Long falahCycleId);
    Optional<PriorityAssessment> findByUserIdAndFalahCycleIdIsNull(Long userId);
    PriorityAssessment save(PriorityAssessment assessment);
}
