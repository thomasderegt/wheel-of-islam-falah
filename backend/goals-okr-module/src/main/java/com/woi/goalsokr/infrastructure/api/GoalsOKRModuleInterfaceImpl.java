package com.woi.goalsokr.infrastructure.api;

import com.woi.goalsokr.api.*;
import com.woi.goalsokr.application.commands.*;
import com.woi.goalsokr.application.handlers.commands.*;
import com.woi.goalsokr.application.handlers.queries.*;
import com.woi.goalsokr.application.queries.*;
import com.woi.goalsokr.application.results.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of GoalsOKRModuleInterface
 * This is the public API that other modules can use
 */
@Component
public class GoalsOKRModuleInterfaceImpl implements GoalsOKRModuleInterface {

    // Command handlers
    private final CreateGoalCommandHandler createGoalHandler;
    private final CreateObjectiveCommandHandler createObjectiveHandler;
    private final CreateKeyResultCommandHandler createKeyResultHandler;
    private final StartUserGoalInstanceCommandHandler startUserGoalInstanceHandler;
    private final CompleteUserGoalInstanceCommandHandler completeUserGoalInstanceHandler;
    private final StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler;
    private final CreateInitiativeCommandHandler createInitiativeHandler;
    private final UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler;
    private final UpdateInitiativeCommandHandler updateInitiativeHandler;
    private final CompleteInitiativeCommandHandler completeInitiativeHandler;
    private final CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler;

    // Query handlers
    private final GetGoalQueryHandler getGoalHandler;
    private final GetGoalsByLifeDomainQueryHandler getGoalsByLifeDomainHandler;
    private final GetObjectiveQueryHandler getObjectiveHandler;
    private final GetObjectivesByGoalQueryHandler getObjectivesByGoalHandler;
    private final GetKeyResultQueryHandler getKeyResultHandler;
    private final GetKeyResultsByObjectiveQueryHandler getKeyResultsByObjectiveHandler;
    private final GetUserGoalInstanceQueryHandler getUserGoalInstanceHandler;
    private final GetUserGoalInstancesByUserQueryHandler getUserGoalInstancesByUserHandler;
    private final GetUserGoalInstancesByGoalQueryHandler getUserGoalInstancesByGoalHandler;
    private final GetUserObjectiveInstanceQueryHandler getUserObjectiveInstanceHandler;
    private final GetUserObjectiveInstancesQueryHandler getUserObjectiveInstancesHandler;
    private final GetInitiativesByUserObjectiveInstanceQueryHandler getInitiativesByUserObjectiveInstanceHandler;
    private final GetInitiativesByUserQueryHandler getInitiativesByUserHandler;
    private final GetKeyResultProgressQueryHandler getKeyResultProgressHandler;
    private final GetInitiativeQueryHandler getInitiativeHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;
    private final GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler;

    public GoalsOKRModuleInterfaceImpl(
            CreateGoalCommandHandler createGoalHandler,
            CreateObjectiveCommandHandler createObjectiveHandler,
            CreateKeyResultCommandHandler createKeyResultHandler,
            StartUserGoalInstanceCommandHandler startUserGoalInstanceHandler,
            CompleteUserGoalInstanceCommandHandler completeUserGoalInstanceHandler,
            StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler,
            CreateInitiativeCommandHandler createInitiativeHandler,
            UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler,
            UpdateInitiativeCommandHandler updateInitiativeHandler,
            CompleteInitiativeCommandHandler completeInitiativeHandler,
            CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler,
            GetGoalQueryHandler getGoalHandler,
            GetGoalsByLifeDomainQueryHandler getGoalsByLifeDomainHandler,
            GetObjectiveQueryHandler getObjectiveHandler,
            GetObjectivesByGoalQueryHandler getObjectivesByGoalHandler,
            GetKeyResultQueryHandler getKeyResultHandler,
            GetKeyResultsByObjectiveQueryHandler getKeyResultsByObjectiveHandler,
            GetUserGoalInstanceQueryHandler getUserGoalInstanceHandler,
            GetUserGoalInstancesByUserQueryHandler getUserGoalInstancesByUserHandler,
            GetUserGoalInstancesByGoalQueryHandler getUserGoalInstancesByGoalHandler,
            GetUserObjectiveInstanceQueryHandler getUserObjectiveInstanceHandler,
            GetUserObjectiveInstancesQueryHandler getUserObjectiveInstancesHandler,
            GetInitiativesByUserObjectiveInstanceQueryHandler getInitiativesByUserObjectiveInstanceHandler,
            GetInitiativesByUserQueryHandler getInitiativesByUserHandler,
            GetKeyResultProgressQueryHandler getKeyResultProgressHandler,
            GetInitiativeQueryHandler getInitiativeHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler,
            GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler) {
        this.createGoalHandler = createGoalHandler;
        this.createObjectiveHandler = createObjectiveHandler;
        this.createKeyResultHandler = createKeyResultHandler;
        this.startUserGoalInstanceHandler = startUserGoalInstanceHandler;
        this.completeUserGoalInstanceHandler = completeUserGoalInstanceHandler;
        this.startUserObjectiveInstanceHandler = startUserObjectiveInstanceHandler;
        this.createInitiativeHandler = createInitiativeHandler;
        this.updateKeyResultProgressHandler = updateKeyResultProgressHandler;
        this.updateInitiativeHandler = updateInitiativeHandler;
        this.completeInitiativeHandler = completeInitiativeHandler;
        this.completeUserObjectiveInstanceHandler = completeUserObjectiveInstanceHandler;
        this.getGoalHandler = getGoalHandler;
        this.getGoalsByLifeDomainHandler = getGoalsByLifeDomainHandler;
        this.getObjectiveHandler = getObjectiveHandler;
        this.getObjectivesByGoalHandler = getObjectivesByGoalHandler;
        this.getKeyResultHandler = getKeyResultHandler;
        this.getKeyResultsByObjectiveHandler = getKeyResultsByObjectiveHandler;
        this.getUserGoalInstanceHandler = getUserGoalInstanceHandler;
        this.getUserGoalInstancesByUserHandler = getUserGoalInstancesByUserHandler;
        this.getUserGoalInstancesByGoalHandler = getUserGoalInstancesByGoalHandler;
        this.getUserObjectiveInstanceHandler = getUserObjectiveInstanceHandler;
        this.getUserObjectiveInstancesHandler = getUserObjectiveInstancesHandler;
        this.getInitiativesByUserObjectiveInstanceHandler = getInitiativesByUserObjectiveInstanceHandler;
        this.getInitiativesByUserHandler = getInitiativesByUserHandler;
        this.getKeyResultProgressHandler = getKeyResultProgressHandler;
        this.getInitiativeHandler = getInitiativeHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.updateKanbanItemPositionHandler = updateKanbanItemPositionHandler;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
        this.getKanbanItemsByUserHandler = getKanbanItemsByUserHandler;
    }

    // ========== Goals ==========

    @Override
    public GoalSummary createGoal(Long lifeDomainId, String titleNl, String titleEn,
                                  String descriptionNl, String descriptionEn, Integer orderIndex) {
        GoalResult result = createGoalHandler.handle(
            new CreateGoalCommand(lifeDomainId, titleNl, titleEn, descriptionNl, descriptionEn, orderIndex));
        return toGoalSummary(result);
    }

    @Override
    public Optional<GoalSummary> getGoal(Long goalId) {
        return getGoalHandler.handle(new GetGoalQuery(goalId))
            .map(this::toGoalSummary);
    }

    @Override
    public List<GoalSummary> getGoalsByLifeDomain(Long lifeDomainId) {
        List<GoalResult> results = getGoalsByLifeDomainHandler.handle(
            new GetGoalsByLifeDomainQuery(lifeDomainId));
        return results.stream()
            .map(this::toGoalSummary)
            .collect(Collectors.toList());
    }

    // ========== Objectives ==========

    @Override
    public ObjectiveSummary createObjective(Long goalId, String titleNl, String titleEn,
                                            String descriptionNl, String descriptionEn, Integer orderIndex) {
        ObjectiveResult result = createObjectiveHandler.handle(
            new CreateObjectiveCommand(goalId, titleNl, titleEn, descriptionNl, descriptionEn, orderIndex));
        return toObjectiveSummary(result);
    }

    @Override
    public Optional<ObjectiveSummary> getObjective(Long objectiveId) {
        return getObjectiveHandler.handle(new GetObjectiveQuery(objectiveId))
            .map(this::toObjectiveSummary);
    }

    @Override
    public List<ObjectiveSummary> getObjectivesByGoal(Long goalId) {
        List<ObjectiveResult> results = getObjectivesByGoalHandler.handle(
            new GetObjectivesByGoalQuery(goalId));
        return results.stream()
            .map(this::toObjectiveSummary)
            .collect(Collectors.toList());
    }

    // ========== Key Results ==========

    @Override
    public KeyResultSummary createKeyResult(Long objectiveId, String titleNl, String titleEn,
                                            String descriptionNl, String descriptionEn,
                                            BigDecimal targetValue, String unit, Integer orderIndex) {
        KeyResultResult result = createKeyResultHandler.handle(
            new CreateKeyResultCommand(objectiveId, titleNl, titleEn, descriptionNl, descriptionEn,
                targetValue, unit, orderIndex));
        return toKeyResultSummary(result);
    }

    @Override
    public Optional<KeyResultSummary> getKeyResult(Long keyResultId) {
        return getKeyResultHandler.handle(new GetKeyResultQuery(keyResultId))
            .map(this::toKeyResultSummary);
    }

    @Override
    public List<KeyResultSummary> getKeyResultsByObjective(Long objectiveId) {
        List<KeyResultResult> results = getKeyResultsByObjectiveHandler.handle(
            new GetKeyResultsByObjectiveQuery(objectiveId));
        return results.stream()
            .map(this::toKeyResultSummary)
            .collect(Collectors.toList());
    }

    // ========== User Goal Instances (User-specific - Aggregate Root) ==========

    @Override
    public UserGoalInstanceSummary startUserGoalInstance(Long userId, Long goalId) {
        UserGoalInstanceResult result = startUserGoalInstanceHandler.handle(
            new StartUserGoalInstanceCommand(userId, goalId));
        return toUserGoalInstanceSummary(result);
    }

    @Override
    public Optional<UserGoalInstanceSummary> getUserGoalInstance(Long userGoalInstanceId) {
        return getUserGoalInstanceHandler.handle(new GetUserGoalInstanceQuery(userGoalInstanceId))
            .map(this::toUserGoalInstanceSummary);
    }

    @Override
    public List<UserGoalInstanceSummary> getUserGoalInstancesForUser(Long userId) {
        List<UserGoalInstanceResult> results = getUserGoalInstancesByUserHandler.handle(
            new GetUserGoalInstancesByUserQuery(userId));
        return results.stream()
            .map(this::toUserGoalInstanceSummary)
            .collect(Collectors.toList());
    }

    @Override
    public List<UserGoalInstanceSummary> getUserGoalInstancesByGoal(Long goalId) {
        List<UserGoalInstanceResult> results = getUserGoalInstancesByGoalHandler.handle(
            new GetUserGoalInstancesByGoalQuery(goalId));
        return results.stream()
            .map(this::toUserGoalInstanceSummary)
            .collect(Collectors.toList());
    }

    @Override
    public UserGoalInstanceSummary completeUserGoalInstance(Long userGoalInstanceId) {
        UserGoalInstanceResult result = completeUserGoalInstanceHandler.handle(
            new CompleteUserGoalInstanceCommand(userGoalInstanceId));
        return toUserGoalInstanceSummary(result);
    }

    // ========== User Objective Instances ==========

    @Override
    public UserObjectiveInstanceSummary startUserObjectiveInstance(Long userId, Long userGoalInstanceId, Long objectiveId) {
        UserObjectiveInstanceResult result = startUserObjectiveInstanceHandler.handle(
            new StartUserObjectiveInstanceCommand(userId, userGoalInstanceId, objectiveId));
        return toUserObjectiveInstanceSummary(result);
    }

    @Override
    public Optional<UserObjectiveInstanceSummary> getUserObjectiveInstance(Long userObjectiveInstanceId) {
        return getUserObjectiveInstanceHandler.handle(new GetUserObjectiveInstanceQuery(userObjectiveInstanceId))
            .map(this::toUserObjectiveInstanceSummary);
    }

    @Override
    public List<UserObjectiveInstanceSummary> getUserObjectiveInstancesForUser(Long userId) {
        List<UserObjectiveInstanceResult> results = getUserObjectiveInstancesHandler.handle(
            new GetUserObjectiveInstancesQuery(userId));
        return results.stream()
            .map(this::toUserObjectiveInstanceSummary)
            .collect(Collectors.toList());
    }

    @Override
    public UserObjectiveInstanceSummary completeUserObjectiveInstance(Long userObjectiveInstanceId) {
        UserObjectiveInstanceResult result = completeUserObjectiveInstanceHandler.handle(
            new CompleteUserObjectiveInstanceCommand(userObjectiveInstanceId));
        return toUserObjectiveInstanceSummary(result);
    }

    // ========== Initiatives ==========

    @Override
    public InitiativeSummary createInitiative(Long userId, Long keyResultId, Long userObjectiveInstanceId,
                                                String title, String description, LocalDate targetDate) {
        InitiativeResult result = createInitiativeHandler.handle(
            new CreateInitiativeCommand(userId, keyResultId, userObjectiveInstanceId, title, description, targetDate));
        return toInitiativeSummary(result);
    }

    @Override
    public Optional<InitiativeSummary> getInitiative(Long initiativeId) {
        return getInitiativeHandler.handle(new GetInitiativeQuery(initiativeId))
            .map(this::toInitiativeSummary);
    }

    @Override
    public List<InitiativeSummary> getInitiativesForUser(Long userId) {
        List<InitiativeResult> results = getInitiativesByUserHandler.handle(
            new GetInitiativesByUserQuery(userId));
        return results.stream()
            .map(this::toInitiativeSummary)
            .collect(Collectors.toList());
    }

    @Override
    public List<InitiativeSummary> getInitiativesByUserObjectiveInstance(Long userObjectiveInstanceId) {
        List<InitiativeResult> results = getInitiativesByUserObjectiveInstanceHandler.handle(
            new GetInitiativesByUserObjectiveInstanceQuery(userObjectiveInstanceId));
        return results.stream()
            .map(this::toInitiativeSummary)
            .collect(Collectors.toList());
    }

    @Override
    public InitiativeSummary updateInitiative(Long initiativeId, String title, String description, LocalDate targetDate) {
        InitiativeResult result = updateInitiativeHandler.handle(
            new UpdateInitiativeCommand(initiativeId, title, description, targetDate));
        return toInitiativeSummary(result);
    }

    @Override
    public InitiativeSummary completeInitiative(Long initiativeId) {
        InitiativeResult result = completeInitiativeHandler.handle(
            new CompleteInitiativeCommand(initiativeId));
        return toInitiativeSummary(result);
    }

    // ========== Key Result Progress ==========

    @Override
    public Optional<KeyResultProgressSummary> getKeyResultProgress(Long userId, Long keyResultId, Long userObjectiveInstanceId) {
        return getKeyResultProgressHandler.handle(
            new GetKeyResultProgressQuery(userId, keyResultId, userObjectiveInstanceId))
            .map(this::toKeyResultProgressSummary);
    }

    @Override
    public KeyResultProgressSummary updateKeyResultProgress(Long userId, Long keyResultId, Long userObjectiveInstanceId, BigDecimal currentValue) {
        KeyResultProgressResult result = updateKeyResultProgressHandler.handle(
            new UpdateKeyResultProgressCommand(userId, keyResultId, userObjectiveInstanceId, currentValue));
        return toKeyResultProgressSummary(result);
    }

    // Helper methods

    private GoalSummary toGoalSummary(GoalResult result) {
        return new GoalSummary(
            result.id(),
            result.lifeDomainId(),
            result.titleNl(),
            result.titleEn(),
            result.descriptionNl(),
            result.descriptionEn(),
            result.orderIndex(),
            result.createdAt(),
            result.updatedAt()
        );
    }

    private ObjectiveSummary toObjectiveSummary(ObjectiveResult result) {
        return new ObjectiveSummary(
            result.id(),
            result.goalId(),
            result.titleNl(),
            result.titleEn(),
            result.descriptionNl(),
            result.descriptionEn(),
            result.orderIndex(),
            result.createdAt(),
            result.updatedAt()
        );
    }

    private KeyResultSummary toKeyResultSummary(KeyResultResult result) {
        return new KeyResultSummary(
            result.id(),
            result.objectiveId(),
            result.titleNl(),
            result.titleEn(),
            result.descriptionNl(),
            result.descriptionEn(),
            result.targetValue(),
            result.unit(),
            result.orderIndex(),
            result.createdAt(),
            result.updatedAt()
        );
    }

    private InitiativeSummary toInitiativeSummary(InitiativeResult result) {
        return new InitiativeSummary(
            result.id(),
            result.keyResultId(),
            result.userObjectiveInstanceId(),
            result.title(),
            result.description(),
            result.status(),
            result.targetDate(),
            result.createdAt(),
            result.updatedAt()
        );
    }

    private UserGoalInstanceSummary toUserGoalInstanceSummary(UserGoalInstanceResult result) {
        return new UserGoalInstanceSummary(
            result.id(),
            result.userId(),
            result.goalId(),
            result.startedAt(),
            result.completedAt()
        );
    }

    private UserObjectiveInstanceSummary toUserObjectiveInstanceSummary(UserObjectiveInstanceResult result) {
        return new UserObjectiveInstanceSummary(
            result.id(),
            result.userGoalInstanceId(),
            result.objectiveId(),
            result.startedAt(),
            result.completedAt()
        );
    }

    private KeyResultProgressSummary toKeyResultProgressSummary(KeyResultProgressResult result) {
        return new KeyResultProgressSummary(
            result.id(),
            result.keyResultId(),
            result.userObjectiveInstanceId(),
            result.currentValue(),
            result.updatedAt()
        );
    }

    // ========== Kanban Items ==========

    @Override
    public List<KanbanItemSummary> getKanbanItemsByUser(Long userId) {
        List<KanbanItemResult> results = getKanbanItemsByUserHandler.handle(
            new GetKanbanItemsByUserQuery(userId));
        return results.stream()
            .map(this::toKanbanItemSummary)
            .collect(Collectors.toList());
    }

    @Override
    public KanbanItemSummary addKanbanItem(Long userId, String itemType, Long itemId) {
        KanbanItemResult result = addKanbanItemHandler.handle(
            new AddKanbanItemCommand(userId, itemType, itemId));
        return toKanbanItemSummary(result);
    }

    @Override
    public KanbanItemSummary updateKanbanItemPosition(Long itemId, String columnName, Integer position) {
        KanbanItemResult result = updateKanbanItemPositionHandler.handle(
            new UpdateKanbanItemPositionCommand(itemId, columnName, position));
        return toKanbanItemSummary(result);
    }

    @Override
    public void deleteKanbanItem(Long itemId) {
        deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(itemId));
    }

    private KanbanItemSummary toKanbanItemSummary(KanbanItemResult result) {
        return new KanbanItemSummary(
            result.id(),
            result.userId(),
            result.itemType(),
            result.itemId(),
            result.columnName(),
            result.position(),
            result.notes(),
            result.createdAt() != null ? java.time.LocalDateTime.parse(result.createdAt()) : null,
            result.updatedAt() != null ? java.time.LocalDateTime.parse(result.updatedAt()) : null
        );
    }
}
