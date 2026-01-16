package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.DeleteTemplateCommand;
import com.woi.learning.domain.entities.LearningFlowTemplate;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a learning flow template
 * Only allowed if no enrollments exist
 */
@Component
public class DeleteTemplateCommandHandler {
    private final LearningFlowTemplateRepository templateRepository;
    private final LearningFlowEnrollmentRepository enrollmentRepository;
    
    public DeleteTemplateCommandHandler(
            LearningFlowTemplateRepository templateRepository,
            LearningFlowEnrollmentRepository enrollmentRepository) {
        this.templateRepository = templateRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    
    @Transactional
    public void handle(DeleteTemplateCommand command) {
        // Find template
        LearningFlowTemplate template = templateRepository.findById(command.templateId())
            .orElseThrow(() -> new IllegalArgumentException("Template not found: " + command.templateId()));
        
        // Check if template has enrollments
        long enrollmentCount = enrollmentRepository.countByTemplateId(command.templateId());
        if (enrollmentCount > 0) {
            throw new IllegalStateException("Cannot delete template with existing enrollments");
        }
        
        // Delete template (cascade will delete steps)
        templateRepository.delete(template);
    }
}

