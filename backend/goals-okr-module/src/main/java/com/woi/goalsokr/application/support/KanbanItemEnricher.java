package com.woi.goalsokr.application.support;

import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.entities.Objective;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.goalsokr.domain.entities.KanbanItem;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Enriches KanbanItem with title and lifeDomainId for list endpoints.
 * Resolves OBJECTIVE, KEY_RESULT, INITIATIVE via instance → entity → objective chain.
 */
@Component
public class KanbanItemEnricher {

    private static final String DEFAULT_LANGUAGE = "en";

    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final ObjectiveRepository objectiveRepository;
    private final KeyResultRepository keyResultRepository;
    private final InitiativeRepository initiativeRepository;

    public KanbanItemEnricher(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            ObjectiveRepository objectiveRepository,
            KeyResultRepository keyResultRepository,
            InitiativeRepository initiativeRepository) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.objectiveRepository = objectiveRepository;
        this.keyResultRepository = keyResultRepository;
        this.initiativeRepository = initiativeRepository;
    }

    /**
     * Build enriched result for a kanban item (title + lifeDomainId).
     */
    public KanbanItemResult enrich(KanbanItem item, boolean readOnly) {
        ItemType type = item.getItemType();
        Long itemId = item.getItemId();
        String title = null;
        Long lifeDomainId = null;

        switch (type) {
            case OBJECTIVE -> {
                Optional<UserObjectiveInstance> uoi = userObjectiveInstanceRepository.findById(itemId);
                if (uoi.isPresent()) {
                    Optional<Objective> obj = objectiveRepository.findById(uoi.get().getObjectiveId());
                    if (obj.isPresent()) {
                        title = obj.get().getTitle(DEFAULT_LANGUAGE);
                        lifeDomainId = obj.get().getLifeDomainId();
                    }
                }
            }
            case KEY_RESULT -> {
                Optional<UserKeyResultInstance> ukri = userKeyResultInstanceRepository.findById(itemId);
                if (ukri.isPresent()) {
                    Optional<KeyResult> kr = keyResultRepository.findById(ukri.get().getKeyResultId());
                    if (kr.isPresent()) {
                        title = kr.get().getTitle(DEFAULT_LANGUAGE);
                        Long objectiveId = kr.get().getObjectiveId();
                        if (objectiveId != null) {
                            lifeDomainId = objectiveRepository.findById(objectiveId)
                                .map(Objective::getLifeDomainId)
                                .orElse(null);
                        }
                    }
                }
            }
            case INITIATIVE -> {
                Optional<UserInitiativeInstance> uii = userInitiativeInstanceRepository.findById(itemId);
                if (uii.isPresent()) {
                    Optional<Initiative> init = initiativeRepository.findById(uii.get().getInitiativeId());
                    if (init.isPresent()) {
                        title = init.get().getTitle(DEFAULT_LANGUAGE);
                        Long keyResultId = init.get().getKeyResultId();
                        if (keyResultId != null) {
                            lifeDomainId = keyResultRepository.findById(keyResultId)
                                .flatMap(kr -> objectiveRepository.findById(kr.getObjectiveId()))
                                .map(Objective::getLifeDomainId)
                                .orElse(null);
                        }
                    }
                }
            }
        }

        return KanbanItemResult.from(item, readOnly, title, lifeDomainId);
    }
}
