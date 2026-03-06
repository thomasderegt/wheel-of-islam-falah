package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.Wheel;

import java.util.List;
import java.util.Optional;

/**
 * Domain repository interface for Wheel
 */
public interface WheelRepository {
    
    /**
     * Find all wheels ordered by display order
     */
    List<Wheel> findAllOrderedByDisplayOrder();
    
    /**
     * Find a wheel by ID
     */
    Optional<Wheel> findById(Long id);
    
    /**
     * Find a wheel by wheel key
     */
    Optional<Wheel> findByWheelKey(String wheelKey);

    /**
     * Save a wheel (create or update)
     */
    Wheel save(Wheel wheel);

    /**
     * Delete a wheel by ID
     */
    void deleteById(Long id);

    /**
     * Check if another wheel exists with the same wheel key (excluding given id)
     */
    boolean existsByWheelKeyExcludingId(String wheelKey, Long excludeId);
}
