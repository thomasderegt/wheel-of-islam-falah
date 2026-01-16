package com.woi.learning.infrastructure.api;

import com.woi.learning.api.*;
import com.woi.learning.application.commands.*;
import com.woi.learning.application.handlers.commands.*;
import com.woi.learning.application.handlers.queries.*;
import com.woi.learning.application.queries.*;
import com.woi.learning.application.results.*;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of LearningModuleInterface
 * This is the public API that other modules can use
 */
@Component
public class LearningModuleInterfaceImpl implements LearningModuleInterface {
    
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
    
    // Repositories for validation
    private final LearningFlowStepRepository stepRepository;
    
    public LearningModuleInterfaceImpl(
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
            GetProgressForStepQueryHandler getProgressForStepHandler,
            LearningFlowStepRepository stepRepository) {
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
        this.stepRepository = stepRepository;
    }
    
    // ========== Templates ==========
    
    @Override
    public LearningFlowTemplateSummary createTemplate(String name, String description, Long sectionId, Long createdBy) {
        LearningFlowTemplateResult result = createTemplateHandler.handle(
            new CreateTemplateCommand(name, description, sectionId, createdBy)
        );
        return toSummary(result);
    }
    
    @Override
    public List<LearningFlowTemplateSummary> getAllTemplates() {
        return getAllTemplatesHandler.handle(new GetAllTemplatesQuery()).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<LearningFlowTemplateSummary> getTemplate(Long templateId) {
        try {
            LearningFlowTemplateResult result = getTemplateHandler.handle(new GetTemplateQuery(templateId));
            return Optional.of(toSummary(result));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
    
    @Override
    public List<LearningFlowTemplateSummary> getTemplatesForSection(Long sectionId) {
        return getTemplatesForSectionHandler.handle(new GetTemplatesForSectionQuery(sectionId)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public void deleteTemplate(Long templateId) {
        deleteTemplateHandler.handle(new DeleteTemplateCommand(templateId));
    }
    
    // ========== Steps ==========
    
    @Override
    public LearningFlowStepSummary createStep(Long templateId, Long paragraphId, Integer orderIndex, String questionText) {
        LearningFlowStepResult result = createStepHandler.handle(
            new CreateStepCommand(templateId, paragraphId, orderIndex, questionText)
        );
        return toSummary(result);
    }
    
    @Override
    public List<LearningFlowStepSummary> getStepsForTemplate(Long templateId) {
        return getStepsForTemplateHandler.handle(new GetStepsForTemplateQuery(templateId)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public void deleteStep(Long stepId) {
        deleteStepHandler.handle(new DeleteStepCommand(stepId));
    }
    
    // ========== Enrollments ==========
    
    @Override
    public LearningFlowEnrollmentSummary startEnrollment(Long userId, Long templateId, Long sectionId) {
        LearningFlowEnrollmentResult result = startEnrollmentHandler.handle(
            new StartEnrollmentCommand(userId, templateId, sectionId)
        );
        return toSummary(result);
    }
    
    @Override
    public Optional<LearningFlowEnrollmentSummary> getEnrollment(Long enrollmentId) {
        try {
            LearningFlowEnrollmentResult result = getEnrollmentHandler.handle(new GetEnrollmentQuery(enrollmentId));
            return Optional.of(toSummary(result));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
    
    @Override
    public List<LearningFlowEnrollmentSummary> getEnrollmentsForUser(Long userId) {
        return getEnrollmentsForUserHandler.handle(new GetEnrollmentsForUserQuery(userId)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public void completeEnrollment(Long enrollmentId) {
        completeEnrollmentHandler.handle(new CompleteEnrollmentCommand(enrollmentId));
    }
    
    // ========== Answers ==========
    
    @Override
    public EnrollmentAnswerSummary addAnswer(Long enrollmentId, Long stepId, AnswerType type, String answerText) {
        // Convert API enum to domain enum
        com.woi.learning.domain.enums.AnswerType domainType = 
            com.woi.learning.domain.enums.AnswerType.valueOf(type.name());
        EnrollmentAnswerResult result = addAnswerHandler.handle(
            new AddAnswerCommand(enrollmentId, stepId, domainType, answerText)
        );
        return toSummary(result);
    }
    
    @Override
    public List<EnrollmentAnswerSummary> getAnswers(Long enrollmentId, Long stepId) {
        return getAnswersHandler.handle(new GetAnswersQuery(enrollmentId, stepId, null)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<EnrollmentAnswerSummary> getAnswersByType(Long enrollmentId, Long stepId, AnswerType type) {
        // Convert API enum to domain enum
        com.woi.learning.domain.enums.AnswerType domainType = 
            com.woi.learning.domain.enums.AnswerType.valueOf(type.name());
        return getAnswersHandler.handle(new GetAnswersQuery(enrollmentId, stepId, domainType)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    // ========== Progress ==========
    
    @Override
    public EnrollmentStepProgressSummary updateProgress(Long enrollmentId, Long stepId, ProgressStatus status) {
        // Convert API enum to domain enum
        com.woi.learning.domain.enums.ProgressStatus domainStatus = 
            com.woi.learning.domain.enums.ProgressStatus.valueOf(status.name());
        EnrollmentStepProgressResult result = updateProgressHandler.handle(
            new UpdateProgressCommand(enrollmentId, stepId, domainStatus)
        );
        return toSummary(result);
    }
    
    @Override
    public List<EnrollmentStepProgressSummary> getProgressForEnrollment(Long enrollmentId) {
        return getProgressForEnrollmentHandler.handle(new GetProgressForEnrollmentQuery(enrollmentId)).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<EnrollmentStepProgressSummary> getProgressForStep(Long enrollmentId, Long stepId) {
        EnrollmentStepProgressResult result = getProgressForStepHandler.handle(
            new GetProgressForStepQuery(enrollmentId, stepId)
        );
        return Optional.of(toSummary(result));
    }
    
    // ========== Validation ==========
    
    @Override
    public boolean isParagraphInUse(Long paragraphId) {
        List<com.woi.learning.domain.entities.LearningFlowStep> steps = stepRepository.findByParagraphId(paragraphId);
        return !steps.isEmpty();
    }
    
    // ========== Mappers ==========
    
    private LearningFlowTemplateSummary toSummary(LearningFlowTemplateResult result) {
        return new LearningFlowTemplateSummary(
            result.id(),
            result.name(),
            result.description(),
            result.sectionId(),
            result.createdAt(),
            result.createdBy()
        );
    }
    
    private LearningFlowStepSummary toSummary(LearningFlowStepResult result) {
        return new LearningFlowStepSummary(
            result.id(),
            result.templateId(),
            result.paragraphId(),
            result.orderIndex(),
            result.questionText()
        );
    }
    
    private LearningFlowEnrollmentSummary toSummary(LearningFlowEnrollmentResult result) {
        return new LearningFlowEnrollmentSummary(
            result.id(),
            result.userId(),
            result.templateId(),
            result.sectionId(),
            result.startedAt(),
            result.completedAt()
        );
    }
    
    private EnrollmentAnswerSummary toSummary(EnrollmentAnswerResult result) {
        // Convert domain enum to API enum
        AnswerType apiType = AnswerType.valueOf(result.type().name());
        return new EnrollmentAnswerSummary(
            result.id(),
            result.enrollmentId(),
            result.stepId(),
            apiType,
            result.answerText(),
            result.createdAt()
        );
    }
    
    private EnrollmentStepProgressSummary toSummary(EnrollmentStepProgressResult result) {
        // Convert domain enum to API enum
        ProgressStatus apiStatus = ProgressStatus.valueOf(result.status().name());
        return new EnrollmentStepProgressSummary(
            result.id(),
            result.enrollmentId(),
            result.stepId(),
            apiStatus,
            result.updatedAt()
        );
    }
}

