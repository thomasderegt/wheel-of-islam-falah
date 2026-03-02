package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.FalahCycle;

import java.util.List;
import java.util.Optional;

/**
 * FalahCycle repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface FalahCycleRepository {
    Optional<FalahCycle> findById(Long id);
    List<FalahCycle> findByUserId(Long userId);
    List<FalahCycle> findActiveByUserId(Long userId);
    FalahCycle save(FalahCycle falahCycle);
    void delete(FalahCycle falahCycle);
}
