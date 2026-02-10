package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetUserPreferencesQuery;
import com.woi.user.application.results.UserPreferenceResult;
import com.woi.user.domain.repositories.UserPreferenceRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting user preferences by user ID
 * 
 * Responsibilities:
 * - Orchestrate user preference retrieval
 * - Create default preferences if they don't exist
 * - Map domain entity to result DTO
 */
@Component
public class GetUserPreferencesQueryHandler {
    private final UserPreferenceRepository userPreferenceRepository;
    
    public GetUserPreferencesQueryHandler(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }
    
    public UserPreferenceResult handle(GetUserPreferencesQuery query) {
        // Try to find existing preferences
        Optional<UserPreferenceResult> existing = userPreferenceRepository.findByUserId(query.userId())
            .map(UserPreferenceResult::from);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        // Create default preferences if they don't exist
        var defaultPreference = com.woi.user.domain.entities.UserPreference.createDefault(query.userId());
        var saved = userPreferenceRepository.save(defaultPreference);
        return UserPreferenceResult.from(saved);
    }
}
