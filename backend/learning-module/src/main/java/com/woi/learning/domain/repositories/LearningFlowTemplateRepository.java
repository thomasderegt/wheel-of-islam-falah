package com.woi.learning.domain.repositories;

import com.woi.learning.domain.entities.LearningFlowTemplate;

import java.util.List;
import java.util.Optional;

/**
 * LearningFlowTemplate repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface LearningFlowTemplateRepository {
    Optional<LearningFlowTemplate> findById(Long id);
    List<LearningFlowTemplate> findAll();
    List<LearningFlowTemplate> findBySectionId(Long sectionId);
    LearningFlowTemplate save(LearningFlowTemplate template);
    void delete(LearningFlowTemplate template);
    long countByTemplateId(Long templateId); // For validation: check if template has enrollments
}

