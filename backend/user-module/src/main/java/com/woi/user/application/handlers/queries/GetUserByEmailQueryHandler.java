package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetUserByEmailQuery;
import com.woi.user.application.results.UserResult;
import com.woi.user.domain.repositories.UserRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a user by email
 * 
 * Responsibilities:
 * - Retrieve user by email
 * - Map to result DTO
 */
@Component
public class GetUserByEmailQueryHandler {
    private final UserRepository userRepository;
    
    public GetUserByEmailQueryHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<UserResult> handle(GetUserByEmailQuery query) {
        return userRepository.findByEmail(query.email())
            .map(UserResult::from);
    }
}

