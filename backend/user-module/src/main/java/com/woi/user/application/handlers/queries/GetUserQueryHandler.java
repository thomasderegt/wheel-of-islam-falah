package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetUserQuery;
import com.woi.user.application.results.UserResult;
import com.woi.user.domain.repositories.UserRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a user by ID
 * 
 * Responsibilities:
 * - Orchestrate user retrieval
 * - Map domain entity to result DTO
 */
@Component
public class GetUserQueryHandler {
    private final UserRepository userRepository;
    
    public GetUserQueryHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<UserResult> handle(GetUserQuery query) {
        return userRepository.findById(query.userId())
            .map(UserResult::from);
    }
}

