package com.woi.goalsokr.infrastructure.web.controllers;

import com.woi.goalsokr.application.commands.*;
import com.woi.goalsokr.application.handlers.commands.*;
import com.woi.goalsokr.application.handlers.queries.*;
import com.woi.goalsokr.application.queries.*;
import com.woi.goalsokr.application.results.*;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.infrastructure.web.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final CreateObjectiveCommandHandler createObjectiveHandler;
    private final CreateKeyResultCommandHandler createKeyResultHandler;
    private final DeleteObjectiveCommandHandler deleteObjectiveHandler;
    private final DeleteKeyResultCommandHandler deleteKeyResultHandler;
    private final StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler;
    private final StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler;
    private final StartUserInitiativeInstanceCommandHandler startUserInitiativeInstanceHandler;
    private final CompleteUserKeyResultInstanceCommandHandler completeUserKeyResultInstanceHandler;
    private final CompleteUserInitiativeInstanceCommandHandler completeUserInitiativeInstanceHandler;
    private final CreateInitiativeCommandHandler createInitiativeHandler;
    private final UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler;
    private final UpdateInitiativeCommandHandler updateInitiativeHandler;
    private final CompleteInitiativeCommandHandler completeInitiativeHandler;
    private final DeleteUserInitiativeCommandHandler deleteUserInitiativeHandler;
    private final CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler;

    // Query handlers
    private final GetWheelsQueryHandler getWheelsHandler;
    private final GetLifeDomainsQueryHandler getLifeDomainsHandler;
    private final GetObjectiveQueryHandler getObjectiveHandler;
    private final GetObjectivesByLifeDomainQueryHandler getObjectivesByLifeDomainHandler;
    private final GetKeyResultQueryHandler getKeyResultHandler;
    private final GetKeyResultsByObjectiveQueryHandler getKeyResultsByObjectiveHandler;
    private final GetUserObjectiveInstanceQueryHandler getUserObjectiveInstanceHandler;
    private final GetUserObjectiveInstancesQueryHandler getUserObjectiveInstancesHandler;
    private final GetUserKeyResultInstanceQueryHandler getUserKeyResultInstanceHandler;
    private final GetUserKeyResultInstancesQueryHandler getUserKeyResultInstancesHandler;
    private final GetUserInitiativeInstanceQueryHandler getUserInitiativeInstanceHandler;
    private final GetUserInitiativeInstancesQueryHandler getUserInitiativeInstancesHandler;
    private final DeleteUserInitiativeInstanceCommandHandler deleteUserInitiativeInstanceHandler;
    private final DeleteUserObjectiveInstanceCommandHandler deleteUserObjectiveInstanceHandler;
    private final DeleteUserKeyResultInstanceCommandHandler deleteUserKeyResultInstanceHandler;
    private final GetInitiativesByUserKeyResultInstanceQueryHandler getInitiativesByUserKeyResultInstanceHandler;
    private final GetInitiativesByUserQueryHandler getInitiativesByUserHandler;
    private final GetKeyResultProgressQueryHandler getKeyResultProgressHandler;
    private final GetInitiativeQueryHandler getInitiativeHandler;
    private final GetInitiativesByKeyResultQueryHandler getInitiativesByKeyResultHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler;
    private final UpdateKanbanItemNotesCommandHandler updateKanbanItemNotesHandler;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;
    private final GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler;
    private final GetTeamKanbanItemsQueryHandler getTeamKanbanItemsHandler;
    private final KanbanItemRepository kanbanItemRepository;
    private final ObjectiveRepository objectiveRepository;
    private final KeyResultRepository keyResultRepository;
    
    // Repositories for children endpoints
    private final com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    
    public GoalsOKRController(
            CreateObjectiveCommandHandler createObjectiveHandler,
            CreateKeyResultCommandHandler createKeyResultHandler,
            DeleteObjectiveCommandHandler deleteObjectiveHandler,
            DeleteKeyResultCommandHandler deleteKeyResultHandler,
            StartUserObjectiveInstanceCommandHandler startUserObjectiveInstanceHandler,
            StartUserKeyResultInstanceCommandHandler startUserKeyResultInstanceHandler,
            StartUserInitiativeInstanceCommandHandler startUserInitiativeInstanceHandler,
            CompleteUserKeyResultInstanceCommandHandler completeUserKeyResultInstanceHandler,
            CompleteUserInitiativeInstanceCommandHandler completeUserInitiativeInstanceHandler,
            CreateInitiativeCommandHandler createInitiativeHandler,
            UpdateKeyResultProgressCommandHandler updateKeyResultProgressHandler,
            UpdateInitiativeCommandHandler updateInitiativeHandler,
            CompleteInitiativeCommandHandler completeInitiativeHandler,
            DeleteUserInitiativeCommandHandler deleteUserInitiativeHandler,
            CompleteUserObjectiveInstanceCommandHandler completeUserObjectiveInstanceHandler,
            GetWheelsQueryHandler getWheelsHandler,
            GetLifeDomainsQueryHandler getLifeDomainsHandler,
            GetObjectiveQueryHandler getObjectiveHandler,
            GetObjectivesByLifeDomainQueryHandler getObjectivesByLifeDomainHandler,
            GetKeyResultQueryHandler getKeyResultHandler,
            GetKeyResultsByObjectiveQueryHandler getKeyResultsByObjectiveHandler,
            GetUserObjectiveInstanceQueryHandler getUserObjectiveInstanceHandler,
            GetUserObjectiveInstancesQueryHandler getUserObjectiveInstancesHandler,
            GetUserKeyResultInstanceQueryHandler getUserKeyResultInstanceHandler,
            GetUserKeyResultInstancesQueryHandler getUserKeyResultInstancesHandler,
            GetUserInitiativeInstanceQueryHandler getUserInitiativeInstanceHandler,
            GetUserInitiativeInstancesQueryHandler getUserInitiativeInstancesHandler,
            DeleteUserInitiativeInstanceCommandHandler deleteUserInitiativeInstanceHandler,
            DeleteUserObjectiveInstanceCommandHandler deleteUserObjectiveInstanceHandler,
            DeleteUserKeyResultInstanceCommandHandler deleteUserKeyResultInstanceHandler,
            GetInitiativesByUserKeyResultInstanceQueryHandler getInitiativesByUserKeyResultInstanceHandler,
            GetInitiativesByUserQueryHandler getInitiativesByUserHandler,
            GetKeyResultProgressQueryHandler getKeyResultProgressHandler,
            GetInitiativeQueryHandler getInitiativeHandler,
            GetInitiativesByKeyResultQueryHandler getInitiativesByKeyResultHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            UpdateKanbanItemPositionCommandHandler updateKanbanItemPositionHandler,
            UpdateKanbanItemNotesCommandHandler updateKanbanItemNotesHandler,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler,
            GetKanbanItemsByUserQueryHandler getKanbanItemsByUserHandler,
            GetTeamKanbanItemsQueryHandler getTeamKanbanItemsHandler,
            KanbanItemRepository kanbanItemRepository,
            ObjectiveRepository objectiveRepository,
            KeyResultRepository keyResultRepository,
            com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository userInitiativeInstanceRepository
) {
        this.createObjectiveHandler = createObjectiveHandler;
        this.createKeyResultHandler = createKeyResultHandler;
        this.deleteObjectiveHandler = deleteObjectiveHandler;
        this.deleteKeyResultHandler = deleteKeyResultHandler;
        this.startUserObjectiveInstanceHandler = startUserObjectiveInstanceHandler;
        this.startUserKeyResultInstanceHandler = startUserKeyResultInstanceHandler;
        this.startUserInitiativeInstanceHandler = startUserInitiativeInstanceHandler;
        this.completeUserKeyResultInstanceHandler = completeUserKeyResultInstanceHandler;
        this.completeUserInitiativeInstanceHandler = completeUserInitiativeInstanceHandler;
        this.createInitiativeHandler = createInitiativeHandler;
        this.updateKeyResultProgressHandler = updateKeyResultProgressHandler;
        this.updateInitiativeHandler = updateInitiativeHandler;
        this.completeInitiativeHandler = completeInitiativeHandler;
        this.deleteUserInitiativeHandler = deleteUserInitiativeHandler;
        this.completeUserObjectiveInstanceHandler = completeUserObjectiveInstanceHandler;
        this.getWheelsHandler = getWheelsHandler;
        this.getLifeDomainsHandler = getLifeDomainsHandler;
        this.getObjectiveHandler = getObjectiveHandler;
        this.getObjectivesByLifeDomainHandler = getObjectivesByLifeDomainHandler;
        this.getKeyResultHandler = getKeyResultHandler;
        this.getKeyResultsByObjectiveHandler = getKeyResultsByObjectiveHandler;
        this.getUserObjectiveInstanceHandler = getUserObjectiveInstanceHandler;
        this.getUserObjectiveInstancesHandler = getUserObjectiveInstancesHandler;
        this.getUserKeyResultInstanceHandler = getUserKeyResultInstanceHandler;
        this.getUserKeyResultInstancesHandler = getUserKeyResultInstancesHandler;
        this.getUserInitiativeInstanceHandler = getUserInitiativeInstanceHandler;
        this.getUserInitiativeInstancesHandler = getUserInitiativeInstancesHandler;
        this.deleteUserInitiativeInstanceHandler = deleteUserInitiativeInstanceHandler;
        this.deleteUserObjectiveInstanceHandler = deleteUserObjectiveInstanceHandler;
        this.deleteUserKeyResultInstanceHandler = deleteUserKeyResultInstanceHandler;
        this.getInitiativesByUserKeyResultInstanceHandler = getInitiativesByUserKeyResultInstanceHandler;
        this.getInitiativesByUserHandler = getInitiativesByUserHandler;
        this.getKeyResultProgressHandler = getKeyResultProgressHandler;
        this.getInitiativeHandler = getInitiativeHandler;
        this.getInitiativesByKeyResultHandler = getInitiativesByKeyResultHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.updateKanbanItemPositionHandler = updateKanbanItemPositionHandler;
        this.updateKanbanItemNotesHandler = updateKanbanItemNotesHandler;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
        this.getKanbanItemsByUserHandler = getKanbanItemsByUserHandler;
        this.getTeamKanbanItemsHandler = getTeamKanbanItemsHandler;
        this.kanbanItemRepository = kanbanItemRepository;
        this.objectiveRepository = objectiveRepository;
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
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
                request.lifeDomainId(),
                request.titleNl(),
                request.titleEn(),
                request.descriptionNl(),
                request.descriptionEn(),
                request.orderIndex(),
                null // template - no created_by_user_id
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
    /**
     * Get all objectives for a life domain
     * GET /api/v2/goals-okr/life-domains/{lifeDomainId}/objectives
     */
    @GetMapping("/life-domains/{lifeDomainId}/objectives")
    public ResponseEntity<List<ObjectiveResult>> getObjectivesByLifeDomain(
            @PathVariable Long lifeDomainId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        List<ObjectiveResult> results = getObjectivesByLifeDomainHandler.handle(
            new GetObjectivesByLifeDomainQuery(lifeDomainId, userId));
        return ResponseEntity.ok(results);
    }

    @GetMapping("/objectives/{objectiveId}")
    public ResponseEntity<?> getObjective(
            @PathVariable Long objectiveId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        try {
            var objectiveOpt = objectiveRepository.findById(objectiveId);
            if (objectiveOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            var objective = objectiveOpt.get();
            if (objective.getCreatedByUserId() != null && !objective.getCreatedByUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: objective belongs to another user"));
            }
            return ResponseEntity.ok(ObjectiveResult.from(objective));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Delete an objective. Custom objectives: only owner can delete. Templates: allowed.
     * DELETE /api/v2/goals-okr/objectives/{objectiveId}
     */
    @DeleteMapping("/objectives/{objectiveId}")
    @Transactional
    public ResponseEntity<?> deleteObjective(
            @PathVariable Long objectiveId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        try {
            var objectiveOpt = objectiveRepository.findById(objectiveId);
            if (objectiveOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            var objective = objectiveOpt.get();
            if (objective.getCreatedByUserId() != null && !objective.getCreatedByUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: can only delete your own custom objectives"));
            }
            deleteObjectiveHandler.handle(new DeleteObjectiveCommand(objectiveId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // ========== Key Results ==========

    /**
     * Create a new key result
     * POST /api/v2/goals-okr/key-results
     */
    @PostMapping("/key-results")
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
     * Delete a key result. Custom key results: only owner can delete. Templates: allowed.
     * DELETE /api/v2/goals-okr/key-results/{keyResultId}
     */
    @RequestMapping(path = "/key-results/{keyResultId}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> deleteKeyResult(
            @PathVariable Long keyResultId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        try {
            var keyResultOpt = keyResultRepository.findById(keyResultId);
            if (keyResultOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            var keyResult = keyResultOpt.get();
            if (keyResult.getCreatedByUserId() != null && !keyResult.getCreatedByUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: can only delete your own custom key results"));
            }
            deleteKeyResultHandler.handle(new DeleteKeyResultCommand(keyResultId));
            return ResponseEntity.noContent().build();
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
    public ResponseEntity<?> getKeyResult(
            @PathVariable Long keyResultId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        try {
            var keyResultOpt = keyResultRepository.findById(keyResultId);
            if (keyResultOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            var keyResult = keyResultOpt.get();
            if (keyResult.getCreatedByUserId() != null && !keyResult.getCreatedByUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: key result belongs to another user"));
            }
            return ResponseEntity.ok(KeyResultResult.from(keyResult));
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
    public ResponseEntity<List<KeyResultResult>> getKeyResultsByObjective(
            @PathVariable Long objectiveId,
            @AuthenticationPrincipal(expression = "#this == null ? null : #this") Long userId) {
        List<KeyResultResult> results = getKeyResultsByObjectiveHandler.handle(
            new GetKeyResultsByObjectiveQuery(objectiveId, userId));
        return ResponseEntity.ok(results);
    }

    // ========== User Objective Instances ==========

    /**
     * Get all user objective instances for a user
     * GET /api/v2/goals-okr/users/{userId}/user-objective-instances
     */
    @GetMapping("/users/{userId}/user-objective-instances")
    public ResponseEntity<List<UserObjectiveInstanceResult>> getUserObjectiveInstancesByUser(@PathVariable Long userId) {
        try {
            List<UserObjectiveInstanceResult> results = getUserObjectiveInstancesHandler.handle(
                new GetUserObjectiveInstancesQuery(userId));
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    /**
     * Start a new user objective instance
     * POST /api/v2/goals-okr/user-objective-instances
     */
    @PostMapping("/user-objective-instances")
    public ResponseEntity<?> startUserObjectiveInstance(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long objectiveId = request.get("objectiveId");
            
            if (userId == null || objectiveId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID and Objective ID are required"));
            }
            
            UserObjectiveInstanceResult result = startUserObjectiveInstanceHandler.handle(
                new StartUserObjectiveInstanceCommand(userId, objectiveId));
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
     * Get all user key result instances for a user objective instance
     * GET /api/v2/goals-okr/user-objective-instances/{userObjectiveInstanceId}/user-key-result-instances
     */
    @GetMapping("/user-objective-instances/{userObjectiveInstanceId}/user-key-result-instances")
    public ResponseEntity<List<UserKeyResultInstanceResult>> getUserKeyResultInstancesByUserObjectiveInstance(
            @PathVariable Long userObjectiveInstanceId) {
        try {
            List<UserKeyResultInstanceResult> results = userKeyResultInstanceRepository
                .findByUserObjectiveInstanceId(userObjectiveInstanceId).stream()
                .map(UserKeyResultInstanceResult::from)
                .toList();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of());
        }
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
        try {
            List<UserKeyResultInstanceResult> results = getUserKeyResultInstancesHandler.handle(
                new GetUserKeyResultInstancesQuery(userId));
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    /**
     * Get all user initiative instances for a user key result instance
     * GET /api/v2/goals-okr/user-key-result-instances/{userKeyResultInstanceId}/user-initiative-instances
     */
    @GetMapping("/user-key-result-instances/{userKeyResultInstanceId}/user-initiative-instances")
    public ResponseEntity<List<UserInitiativeInstanceResult>> getUserInitiativeInstancesByUserKeyResultInstance(
            @PathVariable Long userKeyResultInstanceId) {
        try {
            List<UserInitiativeInstanceResult> results = userInitiativeInstanceRepository
                .findByUserKeyResultInstanceId(userKeyResultInstanceId).stream()
                .map(UserInitiativeInstanceResult::from)
                .toList();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of());
        }
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

    // ========== User Initiative Instances ==========

    /**
     * Start a new user initiative instance
     * POST /api/v2/goals-okr/user-initiative-instances
     */
    @PostMapping("/user-initiative-instances")
    @Transactional
    public ResponseEntity<?> startUserInitiativeInstance(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long userKeyResultInstanceId = request.get("userKeyResultInstanceId");
            Long initiativeId = request.get("initiativeId");
            
            if (userId == null || userKeyResultInstanceId == null || initiativeId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID, User Key Result Instance ID, and Initiative ID are required"));
            }
            
            UserInitiativeInstanceResult result = startUserInitiativeInstanceHandler.handle(
                new StartUserInitiativeInstanceCommand(userId, userKeyResultInstanceId, initiativeId));
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
     * Get a user initiative instance by ID
     * GET /api/v2/goals-okr/user-initiative-instances/{id}
     */
    @GetMapping("/user-initiative-instances/{userInitiativeInstanceId}")
    public ResponseEntity<?> getUserInitiativeInstance(@PathVariable Long userInitiativeInstanceId) {
        try {
            Optional<UserInitiativeInstanceResult> result = getUserInitiativeInstanceHandler.handle(
                new GetUserInitiativeInstanceQuery(userInitiativeInstanceId));
            return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Delete a user initiative instance (and its kanban item if present)
     * DELETE /api/v2/goals-okr/user-initiative-instances/{userInitiativeInstanceId}
     */
    @DeleteMapping("/user-initiative-instances/{userInitiativeInstanceId}")
    public ResponseEntity<?> deleteUserInitiativeInstance(@PathVariable Long userInitiativeInstanceId) {
        try {
            deleteUserInitiativeInstanceHandler.handle(new DeleteUserInitiativeInstanceCommand(userInitiativeInstanceId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get all user initiative instances for a user
     * GET /api/v2/goals-okr/users/{userId}/user-initiative-instances
     */
    @GetMapping("/users/{userId}/user-initiative-instances")
    public ResponseEntity<List<UserInitiativeInstanceResult>> getUserInitiativeInstancesForUser(@PathVariable Long userId) {
        List<UserInitiativeInstanceResult> results = getUserInitiativeInstancesHandler.handle(
            new GetUserInitiativeInstancesQuery(userId));
        return ResponseEntity.ok(results);
    }

    /**
     * Complete a user initiative instance
     * POST /api/v2/goals-okr/user-initiative-instances/{id}/complete
     */
    @PostMapping("/user-initiative-instances/{userInitiativeInstanceId}/complete")
    @Transactional
    public ResponseEntity<?> completeUserInitiativeInstance(@PathVariable Long userInitiativeInstanceId) {
        try {
            UserInitiativeInstanceResult result = completeUserInitiativeInstanceHandler.handle(
                new CompleteUserInitiativeInstanceCommand(userInitiativeInstanceId));
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

    /**
     * Delete a user initiative (and its instance(s) and kanban item(s))
     * DELETE /api/v2/goals-okr/initiatives/{initiativeId}
     */
    @DeleteMapping("/initiatives/{initiativeId}")
    public ResponseEntity<?> deleteInitiative(@PathVariable Long initiativeId) {
        try {
            deleteUserInitiativeHandler.handle(new DeleteUserInitiativeCommand(initiativeId));
            return ResponseEntity.noContent().build();
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
     * Get team kanban items (read-only, from team owner)
     * GET /api/v2/goals-okr/teams/{teamId}/kanban-items
     */
    @GetMapping("/teams/{teamId}/kanban-items")
    public ResponseEntity<?> getTeamKanbanItems(
            @PathVariable Long teamId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal Long userId) {
        try {
            List<KanbanItemResult> results = getTeamKanbanItemsHandler.handle(
                new GetTeamKanbanItemsQuery(teamId, userId));
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Get a single kanban item by ID
     * GET /api/v2/goals-okr/kanban-items/{itemId}
     */
    @GetMapping("/kanban-items/{itemId}")
    public ResponseEntity<?> getKanbanItemById(@PathVariable Long itemId) {
        try {
            // Use the repository directly for single item lookup
            Optional<KanbanItem> item = kanbanItemRepository.findById(itemId);
            if (item.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "KanbanItem not found with id: " + itemId));
            }
            KanbanItemResult result = KanbanItemResult.from(item.get());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
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
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            String errorMessage = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred: " + errorMessage));
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
     * Update kanban item notes
     * PUT /api/v2/goals-okr/kanban-items/{itemId}/notes
     */
    @PutMapping("/kanban-items/{itemId}/notes")
    @Transactional
    public ResponseEntity<?> updateKanbanItemNotes(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateKanbanItemNotesRequest request) {
        try {
            UpdateKanbanItemNotesCommand command = new UpdateKanbanItemNotesCommand(
                itemId,
                request.notes()
            );
            KanbanItemResult result = updateKanbanItemNotesHandler.handle(command);
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
     * Delete a kanban item (and its underlying instance).
     * DELETE /api/v2/goals-okr/kanban-items/{itemId}
     * Routes to the appropriate instance delete handler based on item type.
     */
    @DeleteMapping("/kanban-items/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteKanbanItem(@PathVariable Long itemId) {
        try {
            KanbanItem item = kanbanItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("KanbanItem not found with id: " + itemId));

            ItemType itemType = item.getItemType();
            Long instanceId = item.getItemId();

            switch (itemType) {
                case OBJECTIVE -> deleteUserObjectiveInstanceHandler.handle(new DeleteUserObjectiveInstanceCommand(instanceId));
                case KEY_RESULT -> deleteUserKeyResultInstanceHandler.handle(new DeleteUserKeyResultInstanceCommand(instanceId));
                case INITIATIVE -> deleteUserInitiativeInstanceHandler.handle(new DeleteUserInitiativeInstanceCommand(instanceId));
                case GOAL -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(itemId));
                default -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(itemId));
            }
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Delete a user objective instance (and its children, kanban items).
     * DELETE /api/v2/goals-okr/user-objective-instances/{id}
     */
    @DeleteMapping("/user-objective-instances/{userObjectiveInstanceId}")
    @Transactional
    public ResponseEntity<?> deleteUserObjectiveInstance(@PathVariable Long userObjectiveInstanceId) {
        try {
            deleteUserObjectiveInstanceHandler.handle(new DeleteUserObjectiveInstanceCommand(userObjectiveInstanceId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Delete a user key result instance (and its children, kanban items).
     * DELETE /api/v2/goals-okr/user-key-result-instances/{id}
     */
    @DeleteMapping("/user-key-result-instances/{userKeyResultInstanceId}")
    @Transactional
    public ResponseEntity<?> deleteUserKeyResultInstance(@PathVariable Long userKeyResultInstanceId) {
        try {
            deleteUserKeyResultInstanceHandler.handle(new DeleteUserKeyResultInstanceCommand(userKeyResultInstanceId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

}
