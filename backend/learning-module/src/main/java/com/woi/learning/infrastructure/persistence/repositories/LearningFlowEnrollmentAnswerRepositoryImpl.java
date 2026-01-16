package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer;
import com.woi.learning.domain.enums.AnswerType;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentAnswerRepository;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentAnswerJpaEntity;
import com.woi.learning.infrastructure.persistence.mappers.LearningFlowEnrollmentAnswerEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Repository implementation for LearningFlowEnrollmentAnswer
 */
@Repository
public class LearningFlowEnrollmentAnswerRepositoryImpl implements LearningFlowEnrollmentAnswerRepository {
    
    private final LearningFlowEnrollmentAnswerJpaRepository jpaRepository;
    
    public LearningFlowEnrollmentAnswerRepositoryImpl(LearningFlowEnrollmentAnswerJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollmentAnswer> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId) {
        return jpaRepository.findByEnrollmentIdAndStepId(enrollmentId, stepId).stream()
            .map(LearningFlowEnrollmentAnswerEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollmentAnswer> findByEnrollmentIdAndStepIdAndType(Long enrollmentId, Long stepId, AnswerType type) {
        return jpaRepository.findByEnrollmentIdAndStepIdAndAnswerType(enrollmentId, stepId, type).stream()
            .map(LearningFlowEnrollmentAnswerEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LearningFlowEnrollmentAnswer save(LearningFlowEnrollmentAnswer answer) {
        LearningFlowEnrollmentAnswerJpaEntity jpaEntity = LearningFlowEnrollmentAnswerEntityMapper.toJpa(answer);
        LearningFlowEnrollmentAnswerJpaEntity saved = jpaRepository.save(jpaEntity);
        return LearningFlowEnrollmentAnswerEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(LearningFlowEnrollmentAnswer answer) {
        jpaRepository.deleteById(answer.getId());
    }
}

