package com.woi.learning.infrastructure.persistence.repositories;

import com.woi.learning.domain.entities.LearningFlowEnrollment;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import com.woi.learning.infrastructure.persistence.entities.LearningFlowEnrollmentJpaEntity;
import com.woi.learning.infrastructure.persistence.mappers.LearningFlowEnrollmentEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for LearningFlowEnrollment
 */
@Repository
public class LearningFlowEnrollmentRepositoryImpl implements LearningFlowEnrollmentRepository {
    
    private final LearningFlowEnrollmentJpaRepository jpaRepository;
    
    public LearningFlowEnrollmentRepositoryImpl(LearningFlowEnrollmentJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LearningFlowEnrollment> findById(Long id) {
        return jpaRepository.findById(id)
            .map(LearningFlowEnrollmentEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollment> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(LearningFlowEnrollmentEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollment> findByTemplateId(Long templateId) {
        return jpaRepository.findByTemplateId(templateId).stream()
            .map(LearningFlowEnrollmentEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByTemplateId(Long templateId) {
        return jpaRepository.countByTemplateId(templateId);
    }
    
    @Override
    @Transactional
    public LearningFlowEnrollment save(LearningFlowEnrollment enrollment) {
        LearningFlowEnrollmentJpaEntity jpaEntity = LearningFlowEnrollmentEntityMapper.toJpa(enrollment);
        LearningFlowEnrollmentJpaEntity saved = jpaRepository.save(jpaEntity);
        return LearningFlowEnrollmentEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(LearningFlowEnrollment enrollment) {
        jpaRepository.deleteById(enrollment.getId());
    }
}

