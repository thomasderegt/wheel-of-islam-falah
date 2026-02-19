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
    List<Objective> findByLifeDomainIdAndUserFilteredOrderedByOrderIndex(Long lifeDomainId, Long userId);
    Objective save(Objective objective);
    void delete(Objective objective);

    /**
     * Explicitly set created_by_user_id for an objective (e.g. custom objectives).
     * Ensures the value is persisted even if save() did not.
     */
    void updateCreatedByUserId(Long objectiveId, Long userId);
}
