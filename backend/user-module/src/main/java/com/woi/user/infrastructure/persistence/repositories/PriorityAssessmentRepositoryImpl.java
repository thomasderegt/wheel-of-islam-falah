package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.PriorityAssessment;
import com.woi.user.domain.repositories.PriorityAssessmentRepository;
import com.woi.user.infrastructure.persistence.entities.PriorityAssessmentJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.PriorityAssessmentEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class PriorityAssessmentRepositoryImpl implements PriorityAssessmentRepository {
    private final PriorityAssessmentJpaRepository jpaRepository;
    private final PriorityAssessmentEntityMapper mapper;

    public PriorityAssessmentRepositoryImpl(
            PriorityAssessmentJpaRepository jpaRepository,
            PriorityAssessmentEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<PriorityAssessment> findByUserIdAndFalahCycleId(Long userId, Long falahCycleId) {
        return jpaRepository.findByUserIdAndFalahCycleId(userId, falahCycleId)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<PriorityAssessment> findByUserIdAndFalahCycleIdIsNull(Long userId) {
        return jpaRepository.findByUserIdAndFalahCycleIdIsNull(userId)
                .map(mapper::toDomain);
    }

    @Override
    public PriorityAssessment save(PriorityAssessment assessment) {
        PriorityAssessmentJpaEntity jpa = mapper.toJpa(assessment);
        PriorityAssessmentJpaEntity saved = jpaRepository.save(jpa);
        return mapper.toDomain(saved);
    }
}
