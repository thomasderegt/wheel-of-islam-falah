package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativeQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting an initiative by ID.
 * Initiatives are now unified (template and custom) in initiatives table.
 */
@Component
public class GetInitiativeQueryHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public GetInitiativeQueryHandler(
            InitiativeRepository initiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserInitiativeResult> handle(GetInitiativeQuery query) {
        return initiativeRepository.findById(query.initiativeId())
            .map(initiative -> {
                var instances = userInitiativeInstanceRepository.findByInitiativeId(initiative.getId());
                Long instanceId = instances.isEmpty() ? null : instances.get(0).getId();
                Long userKeyResultInstanceId = instances.isEmpty() ? null : instances.get(0).getUserKeyResultInstanceId();
                Long userId = initiative.getCreatedByUserId();
                return UserInitiativeResult.from(initiative, userKeyResultInstanceId, userId, instanceId);
            });
    }
}
