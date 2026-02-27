package com.woi.goalsokr.infrastructure.web.controllers;

import com.woi.goalsokr.application.commands.CreateCustomKeyResultCommand;
import com.woi.goalsokr.application.commands.CreateCustomObjectiveCommand;
import com.woi.goalsokr.application.handlers.commands.CreateCustomKeyResultCommandHandler;
import com.woi.goalsokr.application.handlers.commands.CreateCustomObjectiveCommandHandler;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.infrastructure.web.dtos.CreateCustomKeyResultRequest;
import com.woi.goalsokr.infrastructure.web.dtos.CreateCustomObjectiveRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Logger;

/**
 * Controller for custom objectives and key results.
 * Separate controller to avoid path matching conflicts in GoalsOKRController.
 */
@RestController
@RequestMapping("/api/v2/goals-okr")
@CrossOrigin(origins = "*")
public class CustomObjectivesController {

    private static final Logger log = Logger.getLogger(CustomObjectivesController.class.getName());

    private final CreateCustomObjectiveCommandHandler createCustomObjectiveHandler;
    private final CreateCustomKeyResultCommandHandler createCustomKeyResultHandler;

    public CustomObjectivesController(
            CreateCustomObjectiveCommandHandler createCustomObjectiveHandler,
            CreateCustomKeyResultCommandHandler createCustomKeyResultHandler) {
        this.createCustomObjectiveHandler = createCustomObjectiveHandler;
        this.createCustomKeyResultHandler = createCustomKeyResultHandler;
    }

    /**
     * Create a new custom objective (Objective template + UserObjectiveInstance + Kanban item)
     * POST /api/v2/goals-okr/users/{userId}/objectives/custom
     */
    @PostMapping("/users/{userId}/objectives/custom")
    @Transactional
    public ResponseEntity<?> createCustomObjective(
            @PathVariable Long userId,
            @Valid @RequestBody CreateCustomObjectiveRequest request) {
        Long authUserId = getAuthenticatedUserId();
        if (authUserId == null || !userId.equals(authUserId)) {
            String principalType = getPrincipalTypeForLog();
            log.warning("createCustomObjective 403: pathUserId=" + userId + ", authUserId=" + authUserId + ", principalType=" + principalType);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).headers(headers).body(Map.of("error", "Access denied: not authenticated or user mismatch"));
        }
        try {
            CreateCustomObjectiveCommand command = new CreateCustomObjectiveCommand(
                userId,
                request.lifeDomainId(),
                request.title(),
                request.description()
            );
            UserObjectiveInstanceResult result = createCustomObjectiveHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /**
     * Create a new custom key result (KeyResult template + UserKeyResultInstance + Kanban item)
     * POST /api/v2/goals-okr/users/{userId}/key-results/custom
     */
    @PostMapping("/users/{userId}/key-results/custom")
    @Transactional
    public ResponseEntity<?> createCustomKeyResult(
            @PathVariable Long userId,
            @Valid @RequestBody CreateCustomKeyResultRequest request) {
        Long authUserId = getAuthenticatedUserId();
        if (authUserId == null || !userId.equals(authUserId)) {
            String principalType = getPrincipalTypeForLog();
            log.warning("createCustomKeyResult 403: pathUserId=" + userId + ", authUserId=" + authUserId + ", principalType=" + principalType);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).headers(headers).body(Map.of("error", "Access denied: not authenticated or user mismatch"));
        }
        try {
            CreateCustomKeyResultCommand command = new CreateCustomKeyResultCommand(
                userId,
                request.userObjectiveInstanceId(),
                request.title(),
                request.description(),
                request.targetValue(),
                request.unit()
            );
            UserKeyResultInstanceResult result = createCustomKeyResultHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    /** Get authenticated user id from SecurityContext (set by JwtAuthenticationFilter). Handles Long, Number, and String. */
    private static Long getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof Long l) {
            return l;
        }
        if (principal instanceof Number n) {
            return n.longValue();
        }
        if (principal instanceof String s) {
            try {
                return Long.parseLong(s);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    /** Returns principal class name for diagnostic logging (no PII). */
    private static String getPrincipalTypeForLog() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return "auth=null";
        }
        Object principal = auth.getPrincipal();
        if (principal == null) {
            return "principal=null";
        }
        return principal.getClass().getName();
    }
}
