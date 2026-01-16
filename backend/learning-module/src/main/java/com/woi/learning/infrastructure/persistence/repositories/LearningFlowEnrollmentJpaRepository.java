package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for LearningFlowEnrollmentJpaEntity
 */
@Repository
public interface LearningFlowEnrollmentJpaRepository extends JpaRepository<LearningFlowEnrollmentJpaEntity, Long> {
    List<LearningFlowEnrollmentJpaEntity> findByUserId(Long userId);
    List<LearningFlowEnrollmentJpaEntity> findByTemplateId(Long templateId);
    long countByTemplateId(Long templateId);
}

