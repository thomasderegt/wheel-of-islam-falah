package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.LifeDomain;

import java.util.List;
import java.util.Optional;

/**
 * Domain repository interface for LifeDomain
 */
public interface LifeDomainRepository {
    
    /**
     * Find all life domains ordered by display order
     */
    List<LifeDomain> findAllOrderedByDisplayOrder();
    
    /**
     * Find a life domain by ID
     */
    Optional<LifeDomain> findById(Long id);
}
