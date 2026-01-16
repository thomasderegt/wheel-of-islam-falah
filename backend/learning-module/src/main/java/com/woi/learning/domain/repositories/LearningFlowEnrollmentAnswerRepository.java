package com.woi.learning.domain.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer;
import com.woi.learning.domain.enums.AnswerType;

import java.util.List;

/**
 * LearningFlowEnrollmentAnswer repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface LearningFlowEnrollmentAnswerRepository {
    List<LearningFlowEnrollmentAnswer> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId);
    List<LearningFlowEnrollmentAnswer> findByEnrollmentIdAndStepIdAndType(Long enrollmentId, Long stepId, AnswerType type);
    LearningFlowEnrollmentAnswer save(LearningFlowEnrollmentAnswer answer);
    void delete(LearningFlowEnrollmentAnswer answer);
}

