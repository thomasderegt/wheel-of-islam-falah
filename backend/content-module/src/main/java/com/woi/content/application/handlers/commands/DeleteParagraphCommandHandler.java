package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteParagraphCommand;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.repositories.ParagraphRepository;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Command handler for deleting a paragraph
 * 
 * Responsibilities:
 * - Validate that paragraph exists
 * - Check if paragraph is used in Learning module (optional - only if LearningModuleInterface is available)
 * - Delete paragraph
 */
@Component
public class DeleteParagraphCommandHandler implements ApplicationContextAware {
    private final ParagraphRepository paragraphRepository;
    private ApplicationContext applicationContext;
    
    public DeleteParagraphCommandHandler(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }
    
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
    
    public void handle(DeleteParagraphCommand command) {
        // 1. Find paragraph
        Paragraph paragraph = paragraphRepository.findById(command.paragraphId())
            .orElseThrow(() -> new IllegalArgumentException("Paragraph not found: " + command.paragraphId()));
        
        // 2. Check if paragraph is used in Learning module (if LearningModuleInterface is available)
        // Use reflection to avoid compile-time dependency
        try {
            Object learningModule = applicationContext.getBean("learningModuleInterfaceImpl");
            if (learningModule != null) {
                java.lang.reflect.Method method = learningModule.getClass().getMethod("isParagraphInUse", Long.class);
                Boolean isInUse = (Boolean) method.invoke(learningModule, command.paragraphId());
                if (Boolean.TRUE.equals(isInUse)) {
                    throw new IllegalStateException("Cannot delete paragraph: it is used in learning flows");
                }
            }
        } catch (Exception e) {
            // Learning module not available or method not found - skip validation
            // This is expected if learning module is not loaded
        }
        
        // 3. Delete paragraph
        paragraphRepository.delete(paragraph);
    }
}

