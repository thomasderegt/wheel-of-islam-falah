package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.Objective;

import java.util.List;
import java.util.Optional;

/**
 * Objective repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ObjectiveRepository {
    Optional<Objective> findById(Long id);
    List<Objective> findByLifeDomainId(Long lifeDomainId);
    List<Objective> findByLifeDomainIdOrderedByOrderIndex(Long lifeDomainId);
    Objective save(Objective objective);
    void delete(Objective objective);
}
