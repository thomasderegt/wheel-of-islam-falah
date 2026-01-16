package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.CreateTemplateCommand;
import com.woi.learning.application.results.LearningFlowTemplateResult;
import com.woi.learning.domain.entities.LearningFlowTemplate;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new learning flow template
 */
@Component
public class CreateTemplateCommandHandler {
    private final LearningFlowTemplateRepository templateRepository;
    
    public CreateTemplateCommandHandler(LearningFlowTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }
    
    @Transactional
    public LearningFlowTemplateResult handle(CreateTemplateCommand command) {
        // Create template (domain factory method validates)
        LearningFlowTemplate template = LearningFlowTemplate.create(
            command.name(),
            command.description(),
            command.sectionId(),
            command.createdBy()
        );
        
        // Save template
        LearningFlowTemplate savedTemplate = templateRepository.save(template);
        
        // Return result
        return LearningFlowTemplateResult.from(savedTemplate);
    }
}

