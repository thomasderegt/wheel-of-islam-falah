package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.StartEnrollmentCommand;
import com.woi.learning.application.results.LearningFlowEnrollmentResult;
import com.woi.learning.domain.entities.LearningFlowEnrollment;
import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for starting a new learning flow enrollment
 */
@Component
public class StartEnrollmentCommandHandler {
    private final LearningFlowEnrollmentRepository enrollmentRepository;
    private final LearningFlowTemplateRepository templateRepository;
    private final LearningFlowStepRepository stepRepository;
    private final LearningFlowEnrollmentStepProgressRepository progressRepository;
    
    public StartEnrollmentCommandHandler(
            LearningFlowEnrollmentRepository enrollmentRepository,
            LearningFlowTemplateRepository templateRepository,
            LearningFlowStepRepository stepRepository,
            LearningFlowEnrollmentStepProgressRepository progressRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.templateRepository = templateRepository;
        this.stepRepository = stepRepository;
        this.progressRepository = progressRepository;
    }
    
    @Transactional
    public LearningFlowEnrollmentResult handle(StartEnrollmentCommand command) {
        // Validate template exists
        var template = templateRepository.findById(command.templateId())
            .orElseThrow(() -> new IllegalArgumentException("Template not found: " + command.templateId()));
        
        // Validate sectionId matches template.sectionId
        if (!template.getSectionId().equals(command.sectionId())) {
            throw new IllegalArgumentException("Enrollment sectionId must match template sectionId");
        }
        
        // Create enrollment (domain factory method validates)
        LearningFlowEnrollment enrollment = LearningFlowEnrollment.start(
            command.userId(),
            command.templateId(),
            command.sectionId()
        );
        
        // Save enrollment
        LearningFlowEnrollment savedEnrollment = enrollmentRepository.save(enrollment);
        
        // Initialize progress for all steps in the template
        List<com.woi.learning.domain.entities.LearningFlowStep> steps = 
            stepRepository.findByTemplateIdOrderByOrderIndex(command.templateId());
        
        for (var step : steps) {
            LearningFlowEnrollmentStepProgress progress = 
                LearningFlowEnrollmentStepProgress.create(savedEnrollment.getId(), step.getId());
            progressRepository.save(progress);
        }
        
        // Return result
        return LearningFlowEnrollmentResult.from(savedEnrollment);
    }
}

