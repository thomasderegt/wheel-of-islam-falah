package com.woi.user.infrastructure.api;

import com.woi.user.api.UserModuleInterface;
import com.woi.user.api.UserSummary;
import com.woi.user.api.UserPreferenceSummary;
import com.woi.user.application.handlers.queries.GetUserByEmailQueryHandler;
import com.woi.user.application.handlers.queries.GetUserQueryHandler;
import com.woi.user.application.handlers.queries.IsUserActiveQueryHandler;
import com.woi.user.application.handlers.queries.GetUserPreferencesQueryHandler;
import com.woi.user.application.handlers.commands.UpdateUserPreferencesCommandHandler;
import com.woi.user.application.queries.GetUserByEmailQuery;
import com.woi.user.application.queries.GetUserQuery;
import com.woi.user.application.queries.IsUserActiveQuery;
import com.woi.user.application.queries.GetUserPreferencesQuery;
import com.woi.user.application.commands.UpdateUserPreferencesCommand;
import com.woi.user.application.results.UserResult;
import com.woi.user.application.results.UserPreferenceResult;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Implementation of UserModuleInterface
 * This is the public API that other modules can use
 */
@Component
public class UserModuleInterfaceImpl implements UserModuleInterface {
    
    private final GetUserQueryHandler getUserHandler;
    private final GetUserByEmailQueryHandler getUserByEmailHandler;
    private final IsUserActiveQueryHandler isUserActiveHandler;
    private final GetUserPreferencesQueryHandler getUserPreferencesHandler;
    private final UpdateUserPreferencesCommandHandler updateUserPreferencesHandler;
    private final UserRepository userRepository;
    
    public UserModuleInterfaceImpl(
            GetUserQueryHandler getUserHandler,
            GetUserByEmailQueryHandler getUserByEmailHandler,
            IsUserActiveQueryHandler isUserActiveHandler,
            GetUserPreferencesQueryHandler getUserPreferencesHandler,
            UpdateUserPreferencesCommandHandler updateUserPreferencesHandler,
            UserRepository userRepository) {
        this.getUserHandler = getUserHandler;
        this.getUserByEmailHandler = getUserByEmailHandler;
        this.isUserActiveHandler = isUserActiveHandler;
        this.getUserPreferencesHandler = getUserPreferencesHandler;
        this.updateUserPreferencesHandler = updateUserPreferencesHandler;
        this.userRepository = userRepository;
    }
    
    @Override
    public Optional<UserSummary> getUserById(Long userId) {
        Optional<UserResult> result = getUserHandler.handle(new GetUserQuery(userId));
        return result.map(this::toSummary);
    }
    
    @Override
    public Optional<UserSummary> getUserByEmail(String email) {
        Optional<UserResult> result = getUserByEmailHandler.handle(new GetUserByEmailQuery(email));
        return result.map(this::toSummary);
    }
    
    @Override
    public boolean userExists(Long userId) {
        return userRepository.findById(userId).isPresent();
    }
    
    @Override
    public boolean isUserActive(Long userId) {
        return isUserActiveHandler.handle(new IsUserActiveQuery(userId));
    }
    
    @Override
    public UserPreferenceSummary getUserPreferences(Long userId) {
        UserPreferenceResult result = getUserPreferencesHandler.handle(new GetUserPreferencesQuery(userId));
        return toPreferenceSummary(result);
    }
    
    @Override
    public UserPreferenceSummary updateUserPreferences(Long userId, com.woi.user.domain.enums.Context defaultContext, com.woi.user.domain.enums.GoalsOkrContext defaultGoalsOkrContext) {
        UserPreferenceResult result = updateUserPreferencesHandler.handle(
            new UpdateUserPreferencesCommand(userId, defaultContext, defaultGoalsOkrContext)
        );
        return toPreferenceSummary(result);
    }
    
    // ========== Mappers ==========
    
    private UserSummary toSummary(UserResult result) {
        return new UserSummary(
            result.id(),
            result.email(),
            result.profileName(),
            result.status(),
            result.createdAt(),
            result.updatedAt()
        );
    }
    
    private UserPreferenceSummary toPreferenceSummary(UserPreferenceResult result) {
        return new UserPreferenceSummary(
            result.id(),
            result.userId(),
            result.defaultContext(),
            result.defaultGoalsOkrContext(),
            result.createdAt(),
            result.updatedAt()
        );
    }
}
