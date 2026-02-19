package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.commands.CreateCustomKeyResultCommand;
import com.woi.goalsokr.application.commands.StartUserKeyResultInstanceCommand;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a custom key result.
 * 1. Creates KeyResult in key_results table (with created_by_user_id)
 * 2. Starts UserKeyResultInstance
 * 3. Adds to kanban board
 */
@Component
public class CreateCustomKeyResultCommandHandler {
    private final KeyResultRepository keyResultRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public CreateCustomKeyResultCommandHandler(
            KeyResultRepository keyResultRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.startUserKeyResultInstanceHandler = startUserKeyResultInstanceHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserKeyResultInstanceResult handle(CreateCustomKeyResultCommand command) {
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        UserObjectiveInstance userObjectiveInstance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found: " + command.userObjectiveInstanceId()));

        if (!userObjectiveInstance.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User objective instance does not belong to user");
        }

        Long objectiveId = userObjectiveInstance.getObjectiveId();
        int orderIndex = keyResultRepository.findByObjectiveId(objectiveId).size() + 1;

        KeyResult keyResult = KeyResult.createCustom(
            objectiveId,
            command.userId(),
            command.title(),
            command.description(),
            command.targetValue(),
            command.unit(),
            orderIndex
        );
        keyResult.setNumber(numberGenerator.generateNextNumber(EntityType.KEY_RESULT));
        KeyResult savedKeyResult = keyResultRepository.save(keyResult);

        UserKeyResultInstanceResult instanceResult = startUserKeyResultInstanceHandler.handle(
            new StartUserKeyResultInstanceCommand(
                command.userId(),
                command.userObjectiveInstanceId(),
                savedKeyResult.getId()
            )
        );

        try {
            addKanbanItemHandler.handle(new AddKanbanItemCommand(
                command.userId(),
                "KEY_RESULT",
                instanceResult.id()
            ));
        } catch (IllegalArgumentException e) {
            if (!"Item already exists in kanban board".equals(e.getMessage())) {
                throw e;
            }
        }

        return instanceResult;
    }
}
