package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.PriorityAssessment;
import com.woi.user.infrastructure.persistence.entities.PriorityAssessmentJpaEntity;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class PriorityAssessmentEntityMapper {

    public PriorityAssessment toDomain(PriorityAssessmentJpaEntity jpa) {
        if (jpa == null) return null;

        PriorityAssessment domain = new PriorityAssessment();
        domain.setId(jpa.getId());
        domain.setUserId(jpa.getUserId());
        domain.setFalahCycleId(jpa.getFalahCycleId());
        domain.setScores(jpa.getScoresJson() == null ? Map.of() : Map.copyOf(jpa.getScoresJson()));
        domain.setSkippedWheels(jpa.getSkippedWheelsJson() == null ? Set.of() : new HashSet<>(jpa.getSkippedWheelsJson()));
        domain.setCreatedAt(jpa.getCreatedAt());
        domain.setUpdatedAt(jpa.getUpdatedAt());
        return domain;
    }

    public PriorityAssessmentJpaEntity toJpa(PriorityAssessment domain) {
        if (domain == null) return null;

        PriorityAssessmentJpaEntity jpa = new PriorityAssessmentJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setFalahCycleId(domain.getFalahCycleId());
        jpa.setScoresJson(domain.getScores() == null ? Map.of() : Map.copyOf(domain.getScores()));
        jpa.setSkippedWheelsJson(domain.getSkippedWheels() == null ? null : domain.getSkippedWheels().stream().sorted().toList());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        return jpa;
    }
}
