package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.infrastructure.persistence.entities.FalahCycleJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between FalahCycle domain entity and FalahCycleJpaEntity
 */
@Component
public class FalahCycleEntityMapper {

    public FalahCycle toDomain(FalahCycleJpaEntity jpa) {
        if (jpa == null) return null;

        FalahCycle cycle = new FalahCycle(); // Reconstitution from persistence
        cycle.setId(jpa.getId());
        cycle.setUserId(jpa.getUserId());
        cycle.setStartedAt(jpa.getStartedAt());
        cycle.setFlowExitedAt(jpa.getFlowExitedAt());
        cycle.setCompletedAt(jpa.getCompletedAt());
        return cycle;
    }

    public FalahCycleJpaEntity toJpa(FalahCycle domain) {
        if (domain == null) return null;

        FalahCycleJpaEntity jpa = new FalahCycleJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setStartedAt(domain.getStartedAt());
        jpa.setFlowExitedAt(domain.getFlowExitedAt());
        jpa.setCompletedAt(domain.getCompletedAt());
        return jpa;
    }
}
