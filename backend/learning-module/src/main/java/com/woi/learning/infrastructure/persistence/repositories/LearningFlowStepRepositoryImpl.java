package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.domain.entities.LearningFlowStep;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowStepJpaEntity;
import com.woi.learning.infrastructure.persistence.mappers.LearningFlowStepEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for LearningFlowStep
 */
@Repository
public class LearningFlowStepRepositoryImpl implements LearningFlowStepRepository {
    
    private final LearningFlowStepJpaRepository jpaRepository;
    
    public LearningFlowStepRepositoryImpl(LearningFlowStepJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LearningFlowStep> findById(Long id) {
        return jpaRepository.findById(id)
            .map(LearningFlowStepEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowStep> findByTemplateId(Long templateId) {
        return jpaRepository.findByTemplateId(templateId).stream()
            .map(LearningFlowStepEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowStep> findByTemplateIdOrderByOrderIndex(Long templateId) {
        return jpaRepository.findByTemplateIdOrderByOrderIndex(templateId).stream()
            .map(LearningFlowStepEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LearningFlowStep> findByTemplateIdAndOrderIndex(Long templateId, Integer orderIndex) {
        return jpaRepository.findByTemplateIdAndOrderIndex(templateId, orderIndex)
            .map(LearningFlowStepEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowStep> findByParagraphId(Long paragraphId) {
        return jpaRepository.findByParagraphId(paragraphId).stream()
            .map(LearningFlowStepEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LearningFlowStep save(LearningFlowStep step) {
        LearningFlowStepJpaEntity jpaEntity = LearningFlowStepEntityMapper.toJpa(step);
        LearningFlowStepJpaEntity saved = jpaRepository.save(jpaEntity);
        return LearningFlowStepEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(LearningFlowStep step) {
        jpaRepository.deleteById(step.getId());
    }
}

