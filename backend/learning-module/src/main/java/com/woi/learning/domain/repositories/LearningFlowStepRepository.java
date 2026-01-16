package com.woi.learning.domain.repositories;

import com.woi.learning.domain.entities.LearningFlowStep;

import java.util.List;
import java.util.Optional;

/**
 * LearningFlowStep repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface LearningFlowStepRepository {
    Optional<LearningFlowStep> findById(Long id);
    List<LearningFlowStep> findByTemplateId(Long templateId);
    List<LearningFlowStep> findByTemplateIdOrderByOrderIndex(Long templateId);
    Optional<LearningFlowStep> findByTemplateIdAndOrderIndex(Long templateId, Integer orderIndex);
    List<LearningFlowStep> findByParagraphId(Long paragraphId); // For validation: check if paragraph is in use
    LearningFlowStep save(LearningFlowStep step);
    void delete(LearningFlowStep step);
}

