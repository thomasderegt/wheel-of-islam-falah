package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.InitiativeSuggestion;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for InitiativeSuggestion
 */
public interface InitiativeSuggestionRepository {
    Optional<InitiativeSuggestion> findById(Long id);
    List<InitiativeSuggestion> findByKeyResultId(Long keyResultId);
    InitiativeSuggestion save(InitiativeSuggestion suggestion);
    void delete(Long id);
}
