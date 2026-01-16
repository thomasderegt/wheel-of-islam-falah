package com.woi.learning.domain.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollment;

import java.util.List;
import java.util.Optional;

/**
 * LearningFlowEnrollment repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface LearningFlowEnrollmentRepository {
    Optional<LearningFlowEnrollment> findById(Long id);
    List<LearningFlowEnrollment> findByUserId(Long userId);
    List<LearningFlowEnrollment> findByTemplateId(Long templateId);
    long countByTemplateId(Long templateId); // For validation: check if template has enrollments
    LearningFlowEnrollment save(LearningFlowEnrollment enrollment);
    void delete(LearningFlowEnrollment enrollment);
}

