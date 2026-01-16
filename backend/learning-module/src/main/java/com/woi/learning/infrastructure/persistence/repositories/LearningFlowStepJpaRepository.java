package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.infrastructure.persistence.entities.LearningFlowStepJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for LearningFlowStepJpaEntity
 */
@Repository
public interface LearningFlowStepJpaRepository extends JpaRepository<LearningFlowStepJpaEntity, Long> {
    List<LearningFlowStepJpaEntity> findByTemplateId(Long templateId);
    List<LearningFlowStepJpaEntity> findByTemplateIdOrderByOrderIndex(Long templateId);
    Optional<LearningFlowStepJpaEntity> findByTemplateIdAndOrderIndex(Long templateId, Integer orderIndex);
    List<LearningFlowStepJpaEntity> findByParagraphId(Long paragraphId);
}

