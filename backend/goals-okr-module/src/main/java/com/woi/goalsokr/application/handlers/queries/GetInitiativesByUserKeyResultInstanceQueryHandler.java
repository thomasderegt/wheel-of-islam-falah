package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserKeyResultInstanceQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Query handler for getting initiatives by user key result instance.
 * Returns both template and custom initiatives (all from initiatives table).
 */
@Component
public class GetInitiativesByUserKeyResultInstanceQueryHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final InitiativeRepository initiativeRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;

    public GetInitiativesByUserKeyResultInstanceQueryHandler(
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            InitiativeRepository initiativeRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.initiativeRepository = initiativeRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeResult> handle(GetInitiativesByUserKeyResultInstanceQuery query) {
        List<UserInitiativeInstance> instances = userInitiativeInstanceRepository.findByUserKeyResultInstanceId(query.userKeyResultInstanceId());
        List<UserInitiativeResult> results = new ArrayList<>();

        Long userId = resolveUserId(query.userKeyResultInstanceId());

        for (UserInitiativeInstance instance : instances) {
            Optional<Initiative> initiativeOpt = initiativeRepository.findById(instance.getInitiativeId());
            initiativeOpt.ifPresent(initiative ->
                results.add(UserInitiativeResult.from(initiative, query.userKeyResultInstanceId(), userId, instance.getId()))
            );
        }
        return results;
    }

    private Long resolveUserId(Long userKeyResultInstanceId) {
        return userKeyResultInstanceRepository.findById(userKeyResultInstanceId)
            .map(UserKeyResultInstance::getUserObjectiveInstanceId)
            .flatMap(userObjectiveInstanceRepository::findById)
            .map(UserObjectiveInstance::getUserId)
            .orElse(null);
    }
}
