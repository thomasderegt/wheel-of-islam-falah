package com.woi.learning.infrastructure.web.controllers;

import com.woi.learning.api.AnswerType;
import com.woi.learning.application.commands.*;
import com.woi.learning.application.handlers.commands.*;
import com.woi.learning.application.handlers.queries.*;
import com.woi.learning.application.queries.*;
import com.woi.learning.application.results.*;
import com.woi.learning.infrastructure.web.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Learning Module
 */
@RestController
@RequestMapping("/api/v2/learning")
@CrossOrigin(origins = "*")
public class LearningController {
    
    // Command handlers
    private final CreateTemplateCommandHandler createTemplateHandler;
    private final CreateStepCommandHandler createStepHandler;
    private final StartEnrollmentCommandHandler startEnrollmentHandler;
    private final AddAnswerCommandHandler addAnswerHandler;
    private final UpdateProgressCommandHandler updateProgressHandler;
    private final CompleteEnrollmentCommandHandler completeEnrollmentHandler;
    private final DeleteTemplateCommandHandler deleteTemplateHandler;
    private final DeleteStepCommandHandler deleteStepHandler;
    
    // Query handlers
    private final GetTemplateQueryHandler getTemplateHandler;
    private final GetAllTemplatesQueryHandler getAllTemplatesHandler;
    private final GetTemplatesForSectionQueryHandler getTemplatesForSectionHandler;
    private final GetStepsForTemplateQueryHandler getStepsForTemplateHandler;
    private final GetEnrollmentQueryHandler getEnrollmentHandler;
    private final GetEnrollmentsForUserQueryHandler getEnrollmentsForUserHandler;
    private final GetAnswersQueryHandler getAnswersHandler;
    private final GetProgressForEnrollmentQueryHandler getProgressForEnrollmentHandler;
    private final GetProgressForStepQueryHandler getProgressForStepHandler;
    
    public LearningController(
            CreateTemplateCommandHandler createTemplateHandler,
            CreateStepCommandHandler createStepHandler,
            StartEnrollmentCommandHandler startEnrollmentHandler,
            AddAnswerCommandHandler addAnswerHandler,
            UpdateProgressCommandHandler updateProgressHandler,
            CompleteEnrollmentCommandHandler completeEnrollmentHandler,
            DeleteTemplateCommandHandler deleteTemplateHandler,
            DeleteStepCommandHandler deleteStepHandler,
            GetTemplateQueryHandler getTemplateHandler,
            GetAllTemplatesQueryHandler getAllTemplatesHandler,
            GetTemplatesForSectionQueryHandler getTemplatesForSectionHandler,
            GetStepsForTemplateQueryHandler getStepsForTemplateHandler,
            GetEnrollmentQueryHandler getEnrollmentHandler,
            GetEnrollmentsForUserQueryHandler getEnrollmentsForUserHandler,
            GetAnswersQueryHandler getAnswersHandler,
            GetProgressForEnrollmentQueryHandler getProgressForEnrollmentHandler,
            GetProgressForStepQueryHandler getProgressForStepHandler) {
        this.createTemplateHandler = createTemplateHandler;
        this.createStepHandler = createStepHandler;
        this.startEnrollmentHandler = startEnrollmentHandler;
        this.addAnswerHandler = addAnswerHandler;
        this.updateProgressHandler = updateProgressHandler;
        this.completeEnrollmentHandler = completeEnrollmentHandler;
        this.deleteTemplateHandler = deleteTemplateHandler;
        this.deleteStepHandler = deleteStepHandler;
        this.getTemplateHandler = getTemplateHandler;
        this.getAllTemplatesHandler = getAllTemplatesHandler;
        this.getTemplatesForSectionHandler = getTemplatesForSectionHandler;
        this.getStepsForTemplateHandler = getStepsForTemplateHandler;
        this.getEnrollmentHandler = getEnrollmentHandler;
        this.getEnrollmentsForUserHandler = getEnrollmentsForUserHandler;
        this.getAnswersHandler = getAnswersHandler;
        this.getProgressForEnrollmentHandler = getProgressForEnrollmentHandler;
        this.getProgressForStepHandler = getProgressForStepHandler;
    }
    
    // ========== Templates ==========
    
    /**
     * Create a new learning flow template
     * POST /api/v2/learning/templates
     */
    @PostMapping("/templates")
    @Transactional
    public ResponseEntity<?> createTemplate(@Valid @RequestBody CreateTemplateRequest request) {
        try {
            CreateTemplateCommand command = new CreateTemplateCommand(
                request.name(),
                request.description(),
                request.sectionId(),
                request.createdBy()
            );
            LearningFlowTemplateResult result = createTemplateHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de template."));
        }
    }
    
    /**
     * Get all templates
     * GET /api/v2/learning/templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<LearningFlowTemplateResult>> getAllTemplates() {
        List<LearningFlowTemplateResult> results = getAllTemplatesHandler.handle(new GetAllTemplatesQuery());
        return ResponseEntity.ok(results);
    }
    
    /**
     * Get a template by ID
     * GET /api/v2/learning/templates/{id}
     */
    @GetMapping("/templates/{id}")
    public ResponseEntity<?> getTemplate(@PathVariable Long id) {
        try {
            LearningFlowTemplateResult result = getTemplateHandler.handle(new GetTemplateQuery(id));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get all templates for a section
     * GET /api/v2/learning/templates/section/{sectionId}
     */
    @GetMapping("/templates/section/{sectionId}")
    public ResponseEntity<List<LearningFlowTemplateResult>> getTemplatesForSection(@PathVariable Long sectionId) {
        List<LearningFlowTemplateResult> results = getTemplatesForSectionHandler.handle(
            new GetTemplatesForSectionQuery(sectionId)
        );
        return ResponseEntity.ok(results);
    }
    
    /**
     * Delete a template
     * DELETE /api/v2/learning/templates/{id}
     */
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        try {
            deleteTemplateHandler.handle(new DeleteTemplateCommand(id));
            return ResponseEntity.ok(Map.of("message", "Template successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            // Template has enrollments - return 400 Bad Request
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de template."));
        }
    }
    
    // ========== Steps ==========
    
    /**
     * Create a new step for a template
     * POST /api/v2/learning/templates/{templateId}/steps
     */
    @PostMapping("/templates/{templateId}/steps")
    @Transactional
    public ResponseEntity<?> createStep(
            @PathVariable Long templateId,
            @Valid @RequestBody CreateStepRequest request) {
        try {
            CreateStepCommand command = new CreateStepCommand(
                templateId,
                request.paragraphId(),
                request.orderIndex(),
                request.questionText()
            );
            LearningFlowStepResult result = createStepHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de step."));
        }
    }
    
    /**
     * Get all steps for a template
     * GET /api/v2/learning/templates/{templateId}/steps
     */
    @GetMapping("/templates/{templateId}/steps")
    public ResponseEntity<List<LearningFlowStepResult>> getStepsForTemplate(@PathVariable Long templateId) {
        List<LearningFlowStepResult> results = getStepsForTemplateHandler.handle(
            new GetStepsForTemplateQuery(templateId)
        );
        return ResponseEntity.ok(results);
    }
    
    /**
     * Delete a step
     * DELETE /api/v2/learning/templates/{templateId}/steps/{stepId}
     */
    @DeleteMapping("/templates/{templateId}/steps/{stepId}")
    public ResponseEntity<?> deleteStep(@PathVariable Long stepId) {
        try {
            deleteStepHandler.handle(new DeleteStepCommand(stepId));
            return ResponseEntity.ok(Map.of("message", "Step successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de step."));
        }
    }
    
    // ========== Enrollments ==========
    
    /**
     * Start a new enrollment
     * POST /api/v2/learning/enrollments
     */
    @PostMapping("/enrollments")
    @Transactional
    public ResponseEntity<?> startEnrollment(@Valid @RequestBody StartEnrollmentRequest request) {
        try {
            StartEnrollmentCommand command = new StartEnrollmentCommand(
                request.userId(),
                request.templateId(),
                request.sectionId()
            );
            LearningFlowEnrollmentResult result = startEnrollmentHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het starten van de enrollment."));
        }
    }
    
    /**
     * Get an enrollment by ID
     * GET /api/v2/learning/enrollments/{id}
     */
    @GetMapping("/enrollments/{id}")
    public ResponseEntity<?> getEnrollment(@PathVariable Long id) {
        try {
            LearningFlowEnrollmentResult result = getEnrollmentHandler.handle(new GetEnrollmentQuery(id));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get all enrollments for a user
     * GET /api/v2/learning/enrollments/user/{userId}
     */
    @GetMapping("/enrollments/user/{userId}")
    public ResponseEntity<List<LearningFlowEnrollmentResult>> getEnrollmentsForUser(@PathVariable Long userId) {
        List<LearningFlowEnrollmentResult> results = getEnrollmentsForUserHandler.handle(
            new GetEnrollmentsForUserQuery(userId)
        );
        return ResponseEntity.ok(results);
    }
    
    /**
     * Complete an enrollment
     * POST /api/v2/learning/enrollments/{id}/complete
     */
    @PostMapping("/enrollments/{id}/complete")
    @Transactional
    public ResponseEntity<?> completeEnrollment(@PathVariable Long id) {
        try {
            completeEnrollmentHandler.handle(new CompleteEnrollmentCommand(id));
            return ResponseEntity.ok(Map.of("message", "Enrollment successfully completed."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het voltooien van de enrollment."));
        }
    }
    
    // ========== Answers ==========
    
    /**
     * Add an answer to an enrollment step
     * POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
     */
    @PostMapping("/enrollments/{enrollmentId}/steps/{stepId}/answers")
    @Transactional
    public ResponseEntity<?> addAnswer(
            @PathVariable Long enrollmentId,
            @PathVariable Long stepId,
            @Valid @RequestBody AddAnswerRequest request) {
        try {
            // Convert API enum to domain enum
            com.woi.learning.domain.enums.AnswerType domainType = 
                com.woi.learning.domain.enums.AnswerType.valueOf(request.type().name());
            AddAnswerCommand command = new AddAnswerCommand(
                enrollmentId,
                stepId,
                domainType,
                request.answerText()
            );
            EnrollmentAnswerResult result = addAnswerHandler.handle(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het toevoegen van het antwoord."));
        }
    }
    
    /**
     * Get all answers for an enrollment step
     * GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers?type={type}
     */
    @GetMapping("/enrollments/{enrollmentId}/steps/{stepId}/answers")
    public ResponseEntity<List<EnrollmentAnswerResult>> getAnswers(
            @PathVariable Long enrollmentId,
            @PathVariable Long stepId,
            @RequestParam(required = false) AnswerType type) {
        // Convert API enum to domain enum if provided
        com.woi.learning.domain.enums.AnswerType domainType = null;
        if (type != null) {
            domainType = com.woi.learning.domain.enums.AnswerType.valueOf(type.name());
        }
        List<EnrollmentAnswerResult> results = getAnswersHandler.handle(
            new GetAnswersQuery(enrollmentId, stepId, domainType)
        );
        return ResponseEntity.ok(results);
    }
    
    // ========== Progress ==========
    
    /**
     * Update progress for an enrollment step
     * POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
     */
    @PostMapping("/enrollments/{enrollmentId}/steps/{stepId}/progress")
    @Transactional
    public ResponseEntity<?> updateProgress(
            @PathVariable Long enrollmentId,
            @PathVariable Long stepId,
            @Valid @RequestBody UpdateProgressRequest request) {
        try {
            // Convert API enum to domain enum
            com.woi.learning.domain.enums.ProgressStatus domainStatus = 
                com.woi.learning.domain.enums.ProgressStatus.valueOf(request.status().name());
            UpdateProgressCommand command = new UpdateProgressCommand(
                enrollmentId,
                stepId,
                domainStatus
            );
            EnrollmentStepProgressResult result = updateProgressHandler.handle(command);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het bijwerken van de voortgang."));
        }
    }
    
    /**
     * Get progress for all steps in an enrollment
     * GET /api/v2/learning/enrollments/{enrollmentId}/progress
     */
    @GetMapping("/enrollments/{enrollmentId}/progress")
    public ResponseEntity<List<EnrollmentStepProgressResult>> getProgressForEnrollment(@PathVariable Long enrollmentId) {
        List<EnrollmentStepProgressResult> results = getProgressForEnrollmentHandler.handle(
            new GetProgressForEnrollmentQuery(enrollmentId)
        );
        return ResponseEntity.ok(results);
    }
    
    /**
     * Get progress for a specific step
     * GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
     */
    @GetMapping("/enrollments/{enrollmentId}/steps/{stepId}/progress")
    public ResponseEntity<EnrollmentStepProgressResult> getProgressForStep(
            @PathVariable Long enrollmentId,
            @PathVariable Long stepId) {
        EnrollmentStepProgressResult result = getProgressForStepHandler.handle(
            new GetProgressForStepQuery(enrollmentId, stepId)
        );
        return ResponseEntity.ok(result);
    }
}

