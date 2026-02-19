package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.Initiative;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Initiative (template)
 */
public interface InitiativeRepository {
    Optional<Initiative> findById(Long id);
    List<Initiative> findByKeyResultId(Long keyResultId);
    List<Initiative> findByCreatedByUserId(Long createdByUserId);
    Initiative save(Initiative initiative);
    void delete(Long id);
}
