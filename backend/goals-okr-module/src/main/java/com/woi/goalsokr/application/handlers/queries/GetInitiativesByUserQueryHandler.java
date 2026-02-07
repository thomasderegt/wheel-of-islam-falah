package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user initiatives by user
 */
@Component
public class GetInitiativesByUserQueryHandler {
    private final UserInitiativeRepository userInitiativeRepository;

    public GetInitiativesByUserQueryHandler(UserInitiativeRepository userInitiativeRepository) {
        this.userInitiativeRepository = userInitiativeRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeResult> handle(GetInitiativesByUserQuery query) {
        // Get all user initiatives for the user
        return userInitiativeRepository.findByUserId(query.userId()).stream()
            .map(UserInitiativeResult::from)
            .collect(Collectors.toList());
    }
}
