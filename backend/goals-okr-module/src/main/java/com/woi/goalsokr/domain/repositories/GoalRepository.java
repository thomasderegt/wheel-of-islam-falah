package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.Goal;

import java.util.List;
import java.util.Optional;

/**
 * Goal repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface GoalRepository {
    Optional<Goal> findById(Long id);
    List<Goal> findByLifeDomainId(Long lifeDomainId);
    List<Goal> findByLifeDomainIdOrderedByOrderIndex(Long lifeDomainId);
    Goal save(Goal goal);
    void delete(Goal goal);
}
