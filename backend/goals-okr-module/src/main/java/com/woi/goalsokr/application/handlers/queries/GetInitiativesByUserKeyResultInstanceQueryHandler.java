package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserKeyResultInstanceQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user initiatives by user key result instance
 */
@Component
public class GetInitiativesByUserKeyResultInstanceQueryHandler {
    private final UserInitiativeRepository userInitiativeRepository;

    public GetInitiativesByUserKeyResultInstanceQueryHandler(UserInitiativeRepository userInitiativeRepository) {
        this.userInitiativeRepository = userInitiativeRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeResult> handle(GetInitiativesByUserKeyResultInstanceQuery query) {
        return userInitiativeRepository.findByUserKeyResultInstanceId(query.userKeyResultInstanceId()).stream()
            .map(UserInitiativeResult::from)
            .collect(Collectors.toList());
    }
}
