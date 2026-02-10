package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Wheel;

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
}
