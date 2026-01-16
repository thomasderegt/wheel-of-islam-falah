package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.IsUserActiveQuery;
import com.woi.user.domain.enums.UserStatus;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;

/**
 * Query handler for checking if a user is active
 * 
 * Responsibilities:
 * - Check user status
 * - Return boolean result
 */
@Component
public class IsUserActiveQueryHandler {
    private final UserRepository userRepository;
    
    public IsUserActiveQueryHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public boolean handle(IsUserActiveQuery query) {
        return userRepository.findById(query.userId())
            .map(user -> user.getStatus() == UserStatus.ACTIVE)
            .orElse(false);
    }
}

