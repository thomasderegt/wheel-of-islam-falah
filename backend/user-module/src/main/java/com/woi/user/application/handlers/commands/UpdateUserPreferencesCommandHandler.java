package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.UpdateUserPreferencesCommand;
import com.woi.user.application.results.UserPreferenceResult;
import com.woi.user.domain.entities.UserPreference;
import com.woi.user.domain.enums.GoalsOkrContext;
import com.woi.user.domain.repositories.UserPreferenceRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating user preferences
 * 
 * Responsibilities:
 * - Find or create user preferences
 * - Update context (always SUCCESS) and Goals-OKR context using domain methods
 * - Save updated preferences
 */
@Component
public class UpdateUserPreferencesCommandHandler {
    private final UserPreferenceRepository userPreferenceRepository;
    
    public UpdateUserPreferencesCommandHandler(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }
    
    public UserPreferenceResult handle(UpdateUserPreferencesCommand command) {
        // Find existing preferences or create default
        Optional<UserPreference> existingOpt = userPreferenceRepository.findByUserId(command.userId());
        
        UserPreference preference;
        if (existingOpt.isPresent()) {
            preference = existingOpt.get();
        } else {
            preference = UserPreference.createDefault(command.userId());
        }
        
        // Update context (always SUCCESS - Content Context)
        preference.updateContext(command.defaultContext());
        
        // Update Goals-OKR context (defaults to NONE if not provided)
        GoalsOkrContext goalsOkrContext = command.defaultGoalsOkrContext();
        if (goalsOkrContext == null) {
            goalsOkrContext = GoalsOkrContext.NONE;
        }
        preference.updateGoalsOkrContext(goalsOkrContext);
        
        // Save and return
        UserPreference saved = userPreferenceRepository.save(preference);
        return UserPreferenceResult.from(saved);
    }
}
