package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentStepProgressJpaEntity;
import com.woi.learning.infrastructure.persistence.mappers.LearningFlowEnrollmentStepProgressEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for LearningFlowEnrollmentStepProgress
 */
@Repository
public class LearningFlowEnrollmentStepProgressRepositoryImpl implements LearningFlowEnrollmentStepProgressRepository {
    
    private final LearningFlowEnrollmentStepProgressJpaRepository jpaRepository;
    
    public LearningFlowEnrollmentStepProgressRepositoryImpl(LearningFlowEnrollmentStepProgressJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LearningFlowEnrollmentStepProgress> findByEnrollmentIdAndStepId(Long enrollmentId, Long stepId) {
        return jpaRepository.findByEnrollmentIdAndStepId(enrollmentId, stepId)
            .map(LearningFlowEnrollmentStepProgressEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollmentStepProgress> findByEnrollmentId(Long enrollmentId) {
        return jpaRepository.findByEnrollmentId(enrollmentId).stream()
            .map(LearningFlowEnrollmentStepProgressEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LearningFlowEnrollmentStepProgress save(LearningFlowEnrollmentStepProgress progress) {
        LearningFlowEnrollmentStepProgressJpaEntity jpaEntity = LearningFlowEnrollmentStepProgressEntityMapper.toJpa(progress);
        LearningFlowEnrollmentStepProgressJpaEntity saved = jpaRepository.save(jpaEntity);
        return LearningFlowEnrollmentStepProgressEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(LearningFlowEnrollmentStepProgress progress) {
        jpaRepository.deleteById(progress.getId());
    }
}

