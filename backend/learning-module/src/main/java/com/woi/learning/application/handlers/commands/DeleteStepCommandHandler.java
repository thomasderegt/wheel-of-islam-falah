package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.DeleteStepCommand;
import com.woi.learning.domain.entities.LearningFlowStep;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a learning flow step
 */
@Component
public class DeleteStepCommandHandler {
    private final LearningFlowStepRepository stepRepository;
    
    public DeleteStepCommandHandler(LearningFlowStepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }
    
    @Transactional
    public void handle(DeleteStepCommand command) {
        // Find step
        LearningFlowStep step = stepRepository.findById(command.stepId())
            .orElseThrow(() -> new IllegalArgumentException("Step not found: " + command.stepId()));
        
        // Delete step
        stepRepository.delete(step);
    }
}

