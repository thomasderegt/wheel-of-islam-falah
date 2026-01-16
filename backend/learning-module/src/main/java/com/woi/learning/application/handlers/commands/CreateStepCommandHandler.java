package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.CreateStepCommand;
import com.woi.learning.application.results.LearningFlowStepResult;
import com.woi.learning.domain.entities.LearningFlowStep;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new learning flow step
 */
@Component
public class CreateStepCommandHandler {
    private final LearningFlowStepRepository stepRepository;
    private final LearningFlowTemplateRepository templateRepository;
    
    public CreateStepCommandHandler(
            LearningFlowStepRepository stepRepository,
            LearningFlowTemplateRepository templateRepository) {
        this.stepRepository = stepRepository;
        this.templateRepository = templateRepository;
    }
    
    @Transactional
    public LearningFlowStepResult handle(CreateStepCommand command) {
        // Validate template exists
        templateRepository.findById(command.templateId())
            .orElseThrow(() -> new IllegalArgumentException("Template not found: " + command.templateId()));
        
        // Check if orderIndex already exists for this template
        stepRepository.findByTemplateIdAndOrderIndex(command.templateId(), command.orderIndex())
            .ifPresent(existing -> {
                throw new IllegalArgumentException("OrderIndex " + command.orderIndex() + " already exists for this template");
            });
        
        // Create step (domain factory method validates)
        LearningFlowStep step = LearningFlowStep.create(
            command.templateId(),
            command.paragraphId(),
            command.orderIndex(),
            command.questionText()
        );
        
        // Save step
        LearningFlowStep savedStep = stepRepository.save(step);
        
        // Return result
        return LearningFlowStepResult.from(savedStep);
    }
}

