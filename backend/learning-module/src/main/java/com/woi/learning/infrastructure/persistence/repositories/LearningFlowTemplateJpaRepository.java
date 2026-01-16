package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.infrastructure.persistence.entities.LearningFlowTemplateJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for LearningFlowTemplateJpaEntity
 */
@Repository
public interface LearningFlowTemplateJpaRepository extends JpaRepository<LearningFlowTemplateJpaEntity, Long> {
    List<LearningFlowTemplateJpaEntity> findBySectionId(Long sectionId);
}

