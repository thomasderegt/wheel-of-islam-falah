package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.domain.entities.LearningFlowTemplate;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowTemplateJpaEntity;
import com.woi.learning.infrastructure.persistence.mappers.LearningFlowTemplateEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for LearningFlowTemplate
 */
@Repository
public class LearningFlowTemplateRepositoryImpl implements LearningFlowTemplateRepository {
    
    private final LearningFlowTemplateJpaRepository jpaRepository;
    
    public LearningFlowTemplateRepositoryImpl(LearningFlowTemplateJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LearningFlowTemplate> findById(Long id) {
        return jpaRepository.findById(id)
            .map(LearningFlowTemplateEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowTemplate> findAll() {
        return jpaRepository.findAll().stream()
            .map(LearningFlowTemplateEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowTemplate> findBySectionId(Long sectionId) {
        return jpaRepository.findBySectionId(sectionId).stream()
            .map(LearningFlowTemplateEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LearningFlowTemplate save(LearningFlowTemplate template) {
        LearningFlowTemplateJpaEntity jpaEntity = LearningFlowTemplateEntityMapper.toJpa(template);
        LearningFlowTemplateJpaEntity saved = jpaRepository.save(jpaEntity);
        return LearningFlowTemplateEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(LearningFlowTemplate template) {
        jpaRepository.deleteById(template.getId());
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByTemplateId(Long templateId) {
        // This method is used to check if a template has enrollments
        // We need to inject the enrollment repository to count enrollments
        // For now, we'll throw UnsupportedOperationException - this should be handled in the application layer
        throw new UnsupportedOperationException("Use LearningFlowEnrollmentRepository.countByTemplateId instead");
    }
}

