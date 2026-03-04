package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.PriorityAssessmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriorityAssessmentJpaRepository extends JpaRepository<PriorityAssessmentJpaEntity, Long> {
    Optional<PriorityAssessmentJpaEntity> findByUserIdAndFalahCycleId(Long userId, Long falahCycleId);
    Optional<PriorityAssessmentJpaEntity> findByUserIdAndFalahCycleIdIsNull(Long userId);
}
