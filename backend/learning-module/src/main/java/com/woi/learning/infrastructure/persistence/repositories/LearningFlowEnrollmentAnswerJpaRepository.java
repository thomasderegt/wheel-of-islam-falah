package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentAnswerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for LearningFlowEnrollmentAnswerJpaEntity
 */
@Repository
public interface LearningFlowEnrollmentAnswerJpaRepository extends JpaRepository<LearningFlowEnrollmentAnswerJpaEntity, Long> {
    List<LearningFlowEnrollmentAnswerJpaEntity> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId);
    List<LearningFlowEnrollmentAnswerJpaEntity> findByEnrollmentIdAndStepIdAndAnswerType(Long enrollmentId, Long stepId, com.woi.learning.domain.enums.AnswerType answerType);
}

