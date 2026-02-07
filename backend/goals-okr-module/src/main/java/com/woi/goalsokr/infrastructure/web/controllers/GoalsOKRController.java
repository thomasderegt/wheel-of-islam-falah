package com.woi.goalsokr.infrastructure.web.controllers;

import com.woi.goalsokr.application.commands.*;
import com.woi.goalsokr.application.handlers.commands.*;
import com.woi.goalsokr.application.handlers.queries.*;
import com.woi.goalsokr.application.queries.*;
import com.woi.goalsokr.application.results.*;
import com.woi.goalsokr.infrastructure.web.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Goals OKR Module
 */
@RestController
@RequestMapping("/api/v2/goals-okr")
@CrossOrigin(origins = "*")
public class GoalsOKRController {

    // Command handlers
    private final CreateGoalCommandHandler createGoalHandler;
    private final CreateObjectiveCommandHandler createObjectiveHandler;
    private final CreateKeyResultCommandHandler createKeyResultHandler;
    private final StartUserGoalInstanceCommandHandler startUserGoalInstanceHandler;
    private final CompleteUserGoalInstanceCommandHandler completeUserGoalInstanceHandler;
    private final StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler;
    private final StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler;
    private final StartUserInitiativeInstanceCommandHandler startUserInitiativeInstanceHandler;
    private final CompleteUserKeyResultInstanceCommandHandler completeUserKeyResultInstanceHandler;
    private final CompleteUserInitiativeInstanceCommandHandler completeUserInitiativeInstanceHandler;
    private final CreateInitiativeCommandHandler createInitiativeHandler;
    private final UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler;
    private final UpdateInitiativeCommandHandler updateInitiativeHandler;
    private final CompleteInitiativeCommandHandler completeInitiativeHandler;
    private final CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler;

    // Query handlers
    private final GetWheelsQueryHandler getWheelsHandler;
    private final GetLifeDomainsQueryHandler getLifeDomainsHandler;
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
    private final GetUserKeyResultInstanceQueryHandler getUserKeyResultInstanceHandler;
    private final GetUserKeyResultInstancesQueryHandler getUserKeyResultInstancesHandler;
    private final GetUserInitiativeInstanceQueryHandler getUserInitiativeInstanceHandler;
    private final GetUserInitiativeInstancesQueryHandler getUserInitiativeInstancesHandler;
    private final GetInitiativesByUserKeyResultInstanceQueryHandler getInitiativesByUserKeyResultInstanceHandler;
    private final GetInitiativesByUserQueryHandler getInitiativesByUserHandler;
    private final GetKeyResultProgressQueryHandler getKeyResultProgressHandler;
    private final GetInitiativeQueryHandler getInitiativeHandler;
    private final GetInitiativesByKeyResultQueryHandler getInitiativesByKeyResultHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;
    private final GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler;
    
    // User-specific command handlers
    private final CreateUserGoalCommandHandler createUserGoalHandler;
    private final CreateUserObjectiveCommandHandler createUserObjectiveHandler;
    private final CreateUserKeyResultCommandHandler createUserKeyResultHandler;
    
    // User-specific query handlers
    private final GetUserGoalsByUserQueryHandler getUserGoalsByUserHandler;
    private final GetUserObjectivesByUserGoalQueryHandler getUserObjectivesByUserGoalHandler;
    private final GetUserKeyResultsByUserObjectiveQueryHandler getUserKeyResultsByUserObjectiveHandler;

    public GoalsOKRController(
            CreateGoalCommandHandler createGoalHandler,
            CreateObjectiveCommandHandler createObjectiveHandler,
            CreateKeyResultCommandHandler createKeyResultHandler,
            StartUserGoalInstanceCommandHandler startUserGoalInstanceHandler,
            CompleteUserGoalInstanceCommandHandler completeUserGoalInstanceHandler,
            StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler,
            StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler,
            StartUserInitiativeInstanceCommandHandler startUserInitiativeInstanceHandler,
            CompleteUserKeyResultInstanceCommandHandler completeUserKeyResultInstanceHandler,
            CompleteUserInitiativeInstanceCommandHandler completeUserInitiativeInstanceHandler,
            CreateInitiativeCommandHandler createInitiativeHandler,
            UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler,
            UpdateInitiativeCommandHandler updateInitiativeHandler,
            CompleteInitiativeCommandHandler completeInitiativeHandler,
            CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler,
            GetWheelsQueryHandler getWheelsHandler,
            GetLifeDomainsQueryHandler getLifeDomainsHandler,
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
            GetUserKeyResultInstanceQueryHandler getUserKeyResultInstanceHandler,
            GetUserKeyResultInstancesQueryHandler getUserKeyResultInstancesHandler,
            GetUserInitiativeInstanceQueryHandler getUserInitiativeInstanceHandler,
            GetUserInitiativeInstancesQueryHandler getUserInitiativeInstancesHandler,
            GetInitiativesByUserKeyResultInstanceQueryHandler getInitiativesByUserKeyResultInstanceHandler,
            GetInitiativesByUserQueryHandler getInitiativesByUserHandler,
            GetKeyResultProgressQueryHandler getKeyResultProgressHandler,
            GetInitiativeQueryHandler getInitiativeHandler,
            GetInitiativesByKeyResultQueryHandler getInitiativesByKeyResultHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler,
            GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler,
            CreateUserGoalCommandHandler createUserGoalHandler,
            CreateUserObjectiveCommandHandler createUserObjectiveHandler,
            CreateUserKeyResultCommandHandler createUserKeyResultHandler,
            GetUserGoalsByUserQueryHandler getUserGoalsByUserHandler,
            GetUserObjectivesByUserGoalQueryHandler getUserObjectivesByUserGoalHandler,
            GetUserKeyResultsByUserObjectiveQueryHandler getUserKeyResultsByUserObjectiveHandler) {
        this.createGoalHandler = createGoalHandler;
        this.createObjectiveHandler = createObjectiveHandler;
        this.createKeyResultHandler = createKeyResultHandler;
        this.startUserGoalInstanceHandler = startUserGoalInstanceHandler;
        this.completeUserGoalInstanceHandler = completeUserGoalInstanceHandler;
        this.startUserObjectiveInstanceHandler = startUserObjectiveInstanceHandler;
        this.startUserKeyResultInstanceHandler = startUserKeyResultInstanceHandler;
        this.startUserInitiativeInstanceHandler = startUserInitiativeInstanceHandler;
        this.completeUserKeyResultInstanceHandler = completeUserKeyResultInstanceHandler;
        this.completeUserInitiativeInstanceHandler = completeUserInitiativeInstanceHandler;
        this.createInitiativeHandler = createInitiativeHandler;
        this.updateKeyResultProgressHandler = updateKeyResultProgressHandler;
        this.updateInitiativeHandler = updateInitiativeHandler;
        this.completeInitiativeHandler = completeInitiativeHandler;
        this.completeUserObjectiveInstanceHandler = completeUserObjectiveInstanceHandler;
        this.getWheelsHandler = getWheelsHandler;
        this.getLifeDomainsHandler = getLifeDomainsHandler;
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
        this.getUserKeyResultInstanceHandler = getUserKeyResultInstanceHandler;
        this.getUserKeyResultInstancesHandler = getUserKeyResultInstancesHandler;
        this.getUserInitiativeInstanceHandler = getUserInitiativeInstanceHandler;
        this.getUserInitiativeInstancesHandler = getUserInitiativeInstancesHandler;
        this.getInitiativesByUserKeyResultInstanceHandler = getInitiativesByUserKeyResultInstanceHandler;
        this.getInitiativesByUserHandler = getInitiativesByUserHandler;
        this.getKeyResultProgressHandler = getKeyResultProgressHandler;
        this.getInitiativeHandler = getInitiativeHandler;
        this.getInitiativesByKeyResultHandler = getInitiativesByKeyResultHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.updateKanbanItemPositionHandler = updateKanbanItemPositionHandler;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
        this.getKanbanItemsByUserHandler = getKanbanItemsByUserHandler;
        this.createUserGoalHandler = createUserGoalHandler;
        this.createUserObjectiveHandler = createUserObjectiveHandler;
        this.createUserKeyResultHandler = createUserKeyResultHandler;
        this.getUserGoalsByUserHandler = getUserGoalsByUserHandler;
        this.getUserObjectivesByUserGoalHandler = getUserObjectivesByUserGoalHandler;
        this.getUserKeyResultsByUserObjectiveHandler = getUserKeyResultsByUserObjectiveHandler;
    }

    // ========== Wheels ==========

    /**
     * Get all wheels
     * GET /api/v2/goals-okr/wheels
     */
    @GetMapping("/wheels")
    public ResponseEntity<List<WheelResult>> getAllWheels() {
        List<WheelResult> results = getWheelsHandler.handle(new GetWheelsQuery());
        return ResponseEntity.ok(results);
    }

    // ========== Life Domains ==========

    /**
     * Get all life domains
     * GET /api/v2/goals-okr/life-domains
     */
    @GetMapping("/life-domains")
    public ResponseEntity<List<LifeDomainResult>> getAllLifeDomains() {
        List<LifeDomainResult> results = getLifeDomainsHandler.handle(new GetLifeDomainsQuery());
        return ResponseEntity.ok(results);
    }

    // ========== Goals ==========

    /**
     * Create a new goal
     * POST /api/v2/goals-okr/goals
     */
    @PostMapping("/goals")
    @Transactional
    public ResponseEntity<?> createGoal(@Valid @RequestBody CreateGoalRequest request) {
        try {
            CreateGoalCommand command = new CreateGoalCommand(
                request.lifeDomainId(),
                request.titleNl(),
                request.titleEn(),
                request.descriptionNl(),
                request.descriptionEn(),
                request.orderIndex()
            );
            GoalResult result = createGoalHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a goal by ID
     * GET /api/v2/goals-okr/goals/{id}
     */
    @GetMapping("/goals/{goalId}")
    public ResponseEntity<?> getGoal(@PathVariable Long goalId) {
        try {
            Optional<GoalResult> result = getGoalHandler.handle(new GetGoalQuery(goalId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all goals for a life domain
     * GET /api/v2/goals-okr/life-domains/{lifeDomainId}/goals
     */
    @GetMapping("/life-domains/{lifeDomainId}/goals")
    public ResponseEntity<List<GoalResult>> getGoalsByLifeDomain(@PathVariable Long lifeDomainId) {
        List<GoalResult> results = getGoalsByLifeDomainHandler.handle(
            new GetGoalsByLifeDomainQuery(lifeDomainId));
        return ResponseEntity.ok(results);
    }

    // ========== Objectives ==========

    /**
     * Create a new objective
     * POST /api/v2/goals-okr/objectives
     */
    @PostMapping("/objectives")
    @Transactional
    public ResponseEntity<?> createObjective(@Valid @RequestBody CreateObjectiveRequest request) {
        try {
            CreateObjectiveCommand command = new CreateObjectiveCommand(
                request.goalId(),
                request.titleNl(),
                request.titleEn(),
                request.descriptionNl(),
                request.descriptionEn(),
                request.orderIndex()
            );
            ObjectiveResult result = createObjectiveHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get an objective by ID
     * GET /api/v2/goals-okr/objectives/{id}
     */
    @GetMapping("/objectives/{objectiveId}")
    public ResponseEntity<?> getObjective(@PathVariable Long objectiveId) {
        try {
            Optional<ObjectiveResult> result = getObjectiveHandler.handle(new GetObjectiveQuery(objectiveId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all objectives for a goal
     * GET /api/v2/goals-okr/goals/{goalId}/objectives
     */
    @GetMapping("/goals/{goalId}/objectives")
    public ResponseEntity<List<ObjectiveResult>> getObjectivesByGoal(@PathVariable Long goalId) {
        List<ObjectiveResult> results = getObjectivesByGoalHandler.handle(
            new GetObjectivesByGoalQuery(goalId));
        return ResponseEntity.ok(results);
    }

    // ========== Key Results ==========

    /**
     * Create a new key result
     * POST /api/v2/goals-okr/key-results
     */
    @PostMapping("/key-results")
    @Transactional
    public ResponseEntity<?> createKeyResult(@Valid @RequestBody CreateKeyResultRequest request) {
        try {
            CreateKeyResultCommand command = new CreateKeyResultCommand(
                request.objectiveId(),
                request.titleNl(),
                request.titleEn(),
                request.descriptionNl(),
                request.descriptionEn(),
                request.targetValue(),
                request.unit(),
                request.orderIndex()
            );
            KeyResultResult result = createKeyResultHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a key result by ID
     * GET /api/v2/goals-okr/key-results/{id}
     */
    @GetMapping("/key-results/{keyResultId}")
    public ResponseEntity<?> getKeyResult(@PathVariable Long keyResultId) {
        try {
            Optional<KeyResultResult> result = getKeyResultHandler.handle(new GetKeyResultQuery(keyResultId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all key results for an objective
     * GET /api/v2/goals-okr/objectives/{objectiveId}/key-results
     */
    @GetMapping("/objectives/{objectiveId}/key-results")
    public ResponseEntity<List<KeyResultResult>> getKeyResultsByObjective(@PathVariable Long objectiveId) {
        List<KeyResultResult> results = getKeyResultsByObjectiveHandler.handle(
            new GetKeyResultsByObjectiveQuery(objectiveId));
        return ResponseEntity.ok(results);
    }

    // ========== User Goal Instances (User-specific - Aggregate Root) ==========

    /**
     * Start a new user goal instance (subscription/enrollment)
     * POST /api/v2/goals-okr/user-goal-instances
     */
    @PostMapping("/user-goal-instances")
    @Transactional
    public ResponseEntity<?> startUserGoalInstance(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long goalId = request.get("goalId");
            
            if (userId == null || goalId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID and Goal ID are required"));
            }
            
            UserGoalInstanceResult result = startUserGoalInstanceHandler.handle(
                new StartUserGoalInstanceCommand(userId, goalId));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a user goal instance by ID
     * GET /api/v2/goals-okr/user-goal-instances/{id}
     */
    @GetMapping("/user-goal-instances/{id}")
    public ResponseEntity<?> getUserGoalInstance(@PathVariable Long id) {
        try {
            Optional<UserGoalInstanceResult> result = getUserGoalInstanceHandler.handle(
                new GetUserGoalInstanceQuery(id));
            return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user goal instances for a user (in which goals is user subscribed?)
     * GET /api/v2/goals-okr/users/{userId}/user-goal-instances
     */
    @GetMapping("/users/{userId}/user-goal-instances")
    public ResponseEntity<List<UserGoalInstanceResult>> getUserGoalInstancesForUser(@PathVariable Long userId) {
        List<UserGoalInstanceResult> results = getUserGoalInstancesByUserHandler.handle(
            new GetUserGoalInstancesByUserQuery(userId));
        return ResponseEntity.ok(results);
    }

    /**
     * Get all user goal instances for a goal (which users are subscribed to this goal?)
     * GET /api/v2/goals-okr/goals/{goalId}/user-goal-instances
     */
    @GetMapping("/goals/{goalId}/user-goal-instances")
    public ResponseEntity<List<UserGoalInstanceResult>> getUserGoalInstancesByGoal(@PathVariable Long goalId) {
        List<UserGoalInstanceResult> results = getUserGoalInstancesByGoalHandler.handle(
            new GetUserGoalInstancesByGoalQuery(goalId));
        return ResponseEntity.ok(results);
    }

    /**
     * Complete a user goal instance
     * POST /api/v2/goals-okr/user-goal-instances/{id}/complete
     */
    @PostMapping("/user-goal-instances/{id}/complete")
    @Transactional
    public ResponseEntity<?> completeUserGoalInstance(@PathVariable Long id) {
        try {
            UserGoalInstanceResult result = completeUserGoalInstanceHandler.handle(
                new CompleteUserGoalInstanceCommand(id));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== User Objective Instances ==========

    /**
     * Start a new user objective instance
     * POST /api/v2/goals-okr/user-objective-instances
     */
    @PostMapping("/user-objective-instances")
    @Transactional
    public ResponseEntity<?> startUserObjectiveInstance(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long userGoalInstanceId = request.get("userGoalInstanceId");
            Long objectiveId = request.get("objectiveId");
            
            if (userId == null || userGoalInstanceId == null || objectiveId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID, User Goal Instance ID, and Objective ID are required"));
            }
            
            UserObjectiveInstanceResult result = startUserObjectiveInstanceHandler.handle(
                new StartUserObjectiveInstanceCommand(userId, userGoalInstanceId, objectiveId));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a user objective instance by ID
     * GET /api/v2/goals-okr/user-objective-instances/{id}
     */
    @GetMapping("/user-objective-instances/{userObjectiveInstanceId}")
    public ResponseEntity<?> getUserObjectiveInstance(@PathVariable Long userObjectiveInstanceId) {
        try {
            Optional<UserObjectiveInstanceResult> result = getUserObjectiveInstanceHandler.handle(
                new GetUserObjectiveInstanceQuery(userObjectiveInstanceId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user objective instances for a user
     * GET /api/v2/goals-okr/users/{userId}/user-objective-instances
     */
    @GetMapping("/users/{userId}/user-objective-instances")
    public ResponseEntity<List<UserObjectiveInstanceResult>> getUserObjectiveInstancesForUser(@PathVariable Long userId) {
        List<UserObjectiveInstanceResult> results = getUserObjectiveInstancesHandler.handle(
            new GetUserObjectiveInstancesQuery(userId));
        return ResponseEntity.ok(results);
    }

    /**
     * Complete a user objective instance
     * POST /api/v2/goals-okr/user-objective-instances/{id}/complete
     */
    @PostMapping("/user-objective-instances/{userObjectiveInstanceId}/complete")
    @Transactional
    public ResponseEntity<?> completeUserObjectiveInstance(@PathVariable Long userObjectiveInstanceId) {
        try {
            UserObjectiveInstanceResult result = completeUserObjectiveInstanceHandler.handle(
                new CompleteUserObjectiveInstanceCommand(userObjectiveInstanceId));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== User Key Result Instances ==========

    /**
     * Start a new user key result instance
     * POST /api/v2/goals-okr/user-key-result-instances
     */
    @PostMapping("/user-key-result-instances")
    @Transactional
    public ResponseEntity<?> startUserKeyResultInstance(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long userObjectiveInstanceId = request.get("userObjectiveInstanceId");
            Long keyResultId = request.get("keyResultId");
            
            if (userId == null || userObjectiveInstanceId == null || keyResultId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID, User Objective Instance ID, and Key Result ID are required"));
            }
            
            UserKeyResultInstanceResult result = startUserKeyResultInstanceHandler.handle(
                new StartUserKeyResultInstanceCommand(userId, userObjectiveInstanceId, keyResultId));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a user key result instance by ID
     * GET /api/v2/goals-okr/user-key-result-instances/{id}
     */
    @GetMapping("/user-key-result-instances/{userKeyResultInstanceId}")
    public ResponseEntity<?> getUserKeyResultInstance(@PathVariable Long userKeyResultInstanceId) {
        try {
            Optional<UserKeyResultInstanceResult> result = getUserKeyResultInstanceHandler.handle(
                new GetUserKeyResultInstanceQuery(userKeyResultInstanceId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user key result instances for a user
     * GET /api/v2/goals-okr/users/{userId}/user-key-result-instances
     */
    @GetMapping("/users/{userId}/user-key-result-instances")
    public ResponseEntity<List<UserKeyResultInstanceResult>> getUserKeyResultInstancesForUser(@PathVariable Long userId) {
        List<UserKeyResultInstanceResult> results = getUserKeyResultInstancesHandler.handle(
            new GetUserKeyResultInstancesQuery(userId));
        return ResponseEntity.ok(results);
    }

    /**
     * Complete a user key result instance
     * POST /api/v2/goals-okr/user-key-result-instances/{id}/complete
     */
    @PostMapping("/user-key-result-instances/{userKeyResultInstanceId}/complete")
    @Transactional
    public ResponseEntity<?> completeUserKeyResultInstance(@PathVariable Long userKeyResultInstanceId) {
        try {
            UserKeyResultInstanceResult result = completeUserKeyResultInstanceHandler.handle(
                new CompleteUserKeyResultInstanceCommand(userKeyResultInstanceId));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== Initiatives ==========

    /**
     * Create a new initiative
     * POST /api/v2/goals-okr/initiatives
     */
    @PostMapping("/initiatives")
    @Transactional
    public ResponseEntity<?> createInitiative(@Valid @RequestBody CreateInitiativeRequest request) {
        try {
            CreateInitiativeCommand command = new CreateInitiativeCommand(
                request.userId(),
                request.keyResultId(),
                request.userKeyResultInstanceId(),
                request.title(),
                request.description(),
                request.targetDate(),
                request.learningFlowEnrollmentId()
            );
            UserInitiativeResult result = createInitiativeHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get an initiative by ID
     * GET /api/v2/goals-okr/initiatives/{id}
     */
    @GetMapping("/initiatives/{initiativeId}")
    public ResponseEntity<?> getInitiative(@PathVariable Long initiativeId) {
        try {
            Optional<UserInitiativeResult> result = getInitiativeHandler.handle(new GetInitiativeQuery(initiativeId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all initiatives for a user
     * GET /api/v2/goals-okr/users/{userId}/initiatives
     */
    @GetMapping("/users/{userId}/initiatives")
    public ResponseEntity<List<UserInitiativeResult>> getInitiativesForUser(@PathVariable Long userId) {
        List<UserInitiativeResult> results = getInitiativesByUserHandler.handle(
            new GetInitiativesByUserQuery(userId));
        return ResponseEntity.ok(results);
    }

    /**
     * Get all initiatives for a user key result instance
     * GET /api/v2/goals-okr/user-key-result-instances/{id}/initiatives
     */
    @GetMapping("/user-key-result-instances/{userKeyResultInstanceId}/initiatives")
    public ResponseEntity<List<UserInitiativeResult>> getInitiativesByUserKeyResultInstance(
            @PathVariable Long userKeyResultInstanceId) {
        List<UserInitiativeResult> results = getInitiativesByUserKeyResultInstanceHandler.handle(
            new GetInitiativesByUserKeyResultInstanceQuery(userKeyResultInstanceId));
        return ResponseEntity.ok(results);
    }

    /**
     * Update an initiative
     * PUT /api/v2/goals-okr/initiatives/{id}
     */
    @PutMapping("/initiatives/{initiativeId}")
    @Transactional
    public ResponseEntity<?> updateInitiative(@PathVariable Long initiativeId,
                                                @Valid @RequestBody UpdateInitiativeRequest request) {
        try {
            UpdateInitiativeCommand command = new UpdateInitiativeCommand(
                initiativeId,
                request.title(),
                request.description(),
                request.targetDate(),
                request.learningFlowEnrollmentId()
            );
            UserInitiativeResult result = updateInitiativeHandler.handle(command);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Complete an initiative
     * POST /api/v2/goals-okr/initiatives/{id}/complete
     */
    @PostMapping("/initiatives/{initiativeId}/complete")
    @Transactional
    public ResponseEntity<?> completeInitiative(@PathVariable Long initiativeId) {
        try {
            UserInitiativeResult result = completeInitiativeHandler.handle(
                new CompleteInitiativeCommand(initiativeId));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== Initiative Templates ==========

    /**
     * Get initiative templates for a key result
     * GET /api/v2/goals-okr/key-results/{keyResultId}/initiatives
     */
    @GetMapping("/key-results/{keyResultId}/initiatives")
    public ResponseEntity<List<InitiativeResult>> getInitiativesByKeyResult(
            @PathVariable Long keyResultId) {
        List<InitiativeResult> results = getInitiativesByKeyResultHandler.handle(
            new GetInitiativesByKeyResultQuery(keyResultId));
        return ResponseEntity.ok(results);
    }

    // ========== Key Result Progress ==========

    /**
     * Get key result progress
     * GET /api/v2/goals-okr/key-result-progress
     */
    @GetMapping("/key-result-progress")
    public ResponseEntity<?> getKeyResultProgress(
            @RequestParam Long userId,
            @RequestParam Long keyResultId,
            @RequestParam Long userKeyResultInstanceId) {
        try {
            Optional<KeyResultProgressResult> result = getKeyResultProgressHandler.handle(
                new GetKeyResultProgressQuery(userId, keyResultId, userKeyResultInstanceId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Update key result progress
     * PUT /api/v2/goals-okr/key-result-progress
     */
    @PutMapping("/key-result-progress")
    @Transactional
    public ResponseEntity<?> updateKeyResultProgress(@Valid @RequestBody UpdateKeyResultProgressRequest request) {
        try {
            UpdateKeyResultProgressCommand command = new UpdateKeyResultProgressCommand(
                request.userId(),
                request.keyResultId(),
                request.userKeyResultInstanceId(),
                request.currentValue()
            );
            KeyResultProgressResult result = updateKeyResultProgressHandler.handle(command);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== Kanban Items ==========

    /**
     * Get all kanban items for a user
     * GET /api/v2/goals-okr/users/{userId}/kanban-items
     */
    @GetMapping("/users/{userId}/kanban-items")
    public ResponseEntity<?> getKanbanItemsByUser(@PathVariable Long userId) {
        try {
            List<KanbanItemResult> results = getKanbanItemsByUserHandler.handle(
                new GetKanbanItemsByUserQuery(userId));
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Add a kanban item
     * POST /api/v2/goals-okr/kanban-items
     */
    @PostMapping("/kanban-items")
    @Transactional
    public ResponseEntity<?> addKanbanItem(@Valid @RequestBody AddKanbanItemRequest request) {
        try {
            AddKanbanItemCommand command = new AddKanbanItemCommand(
                request.userId(),
                request.itemType(),
                request.itemId()
            );
            KanbanItemResult result = addKanbanItemHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Update kanban item position
     * PUT /api/v2/goals-okr/kanban-items/{itemId}/position
     */
    @PutMapping("/kanban-items/{itemId}/position")
    @Transactional
    public ResponseEntity<?> updateKanbanItemPosition(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateKanbanItemPositionRequest request) {
        try {
            UpdateKanbanItemPositionCommand command = new UpdateKanbanItemPositionCommand(
                itemId,
                request.columnName(),
                request.position()
            );
            KanbanItemResult result = updateKanbanItemPositionHandler.handle(command);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Delete a kanban item
     * DELETE /api/v2/goals-okr/kanban-items/{itemId}
     */
    @DeleteMapping("/kanban-items/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteKanbanItem(@PathVariable Long itemId) {
        try {
            deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(itemId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== User-Specific Goals ==========

    /**
     * Create a new user-specific goal
     * POST /api/v2/goals-okr/users/{userId}/user-goals
     */
    @PostMapping("/users/{userId}/user-goals")
    @Transactional
    public ResponseEntity<?> createUserGoal(
            @PathVariable Long userId,
            @Valid @RequestBody CreateUserGoalRequest request) {
        try {
            CreateUserGoalCommand command = new CreateUserGoalCommand(
                userId,
                request.lifeDomainId(),
                request.title(),
                request.description()
            );
            UserGoalResult result = createUserGoalHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user-specific goals for a user
     * GET /api/v2/goals-okr/users/{userId}/user-goals
     */
    @GetMapping("/users/{userId}/user-goals")
    public ResponseEntity<List<UserGoalResult>> getUserGoals(@PathVariable Long userId) {
        List<UserGoalResult> results = getUserGoalsByUserHandler.handle(
            new GetUserGoalsByUserQuery(userId));
        return ResponseEntity.ok(results);
    }

    // ========== User-Specific Objectives ==========

    /**
     * Create a new user-specific objective
     * POST /api/v2/goals-okr/users/{userId}/user-objectives
     */
    @PostMapping("/users/{userId}/user-objectives")
    @Transactional
    public ResponseEntity<?> createUserObjective(
            @PathVariable Long userId,
            @Valid @RequestBody CreateUserObjectiveRequest request) {
        try {
            CreateUserObjectiveCommand command = new CreateUserObjectiveCommand(
                userId,
                request.userGoalId(),
                request.title(),
                request.description()
            );
            UserObjectiveResult result = createUserObjectiveHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user-specific objectives for a user goal
     * GET /api/v2/goals-okr/user-goals/{userGoalId}/user-objectives
     */
    @GetMapping("/user-goals/{userGoalId}/user-objectives")
    public ResponseEntity<List<UserObjectiveResult>> getUserObjectivesByUserGoal(
            @PathVariable Long userGoalId) {
        List<UserObjectiveResult> results = getUserObjectivesByUserGoalHandler.handle(
            new GetUserObjectivesByUserGoalQuery(userGoalId));
        return ResponseEntity.ok(results);
    }

    // ========== User-Specific Key Results ==========

    /**
     * Create a new user-specific key result
     * POST /api/v2/goals-okr/users/{userId}/user-key-results
     */
    @PostMapping("/users/{userId}/user-key-results")
    @Transactional
    public ResponseEntity<?> createUserKeyResult(
            @PathVariable Long userId,
            @Valid @RequestBody CreateUserKeyResultRequest request) {
        try {
            CreateUserKeyResultCommand command = new CreateUserKeyResultCommand(
                userId,
                request.userObjectiveId(),
                request.title(),
                request.description(),
                request.targetValue(),
                request.unit()
            );
            UserKeyResultResult result = createUserKeyResultHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user-specific key results for a user objective
     * GET /api/v2/goals-okr/user-objectives/{userObjectiveId}/user-key-results
     */
    @GetMapping("/user-objectives/{userObjectiveId}/user-key-results")
    public ResponseEntity<List<UserKeyResultResult>> getUserKeyResultsByUserObjective(
            @PathVariable Long userObjectiveId) {
        List<UserKeyResultResult> results = getUserKeyResultsByUserObjectiveHandler.handle(
            new GetUserKeyResultsByUserObjectiveQuery(userObjectiveId));
        return ResponseEntity.ok(results);
    }
}
