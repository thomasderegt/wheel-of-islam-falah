package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Query handler for getting custom initiatives by user.
 * Returns initiatives where created_by_user_id = userId.
 * Includes userInitiativeInstanceId by finding instances for each initiative.
 */
@Component
public class GetInitiativesByUserQueryHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public GetInitiativesByUserQueryHandler(
            InitiativeRepository initiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeResult> handle(GetInitiativesByUserQuery query) {
        List<Initiative> initiatives = initiativeRepository.findByCreatedByUserId(query.userId());
        List<UserInitiativeResult> results = new ArrayList<>();

        for (Initiative initiative : initiatives) {
            // Find instance(s) for this initiative - use first one for user context
            var instances = userInitiativeInstanceRepository.findByInitiativeId(initiative.getId());
            Long instanceId = instances.isEmpty() ? null : instances.get(0).getId();
            Long userKeyResultInstanceId = instances.isEmpty() ? null : instances.get(0).getUserKeyResultInstanceId();
            results.add(UserInitiativeResult.from(initiative, userKeyResultInstanceId, query.userId(), instanceId));
        }
        return results;
    }
}
