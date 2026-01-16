package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateParagraphCommand;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.repositories.ParagraphRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating paragraph metadata
 * 
 * Responsibilities:
 * - Update paragraph number (domain validates)
 */
@Component
public class UpdateParagraphCommandHandler {
    private final ParagraphRepository paragraphRepository;
    
    public UpdateParagraphCommandHandler(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }
    
    public ParagraphResult handle(UpdateParagraphCommand command) {
        // 1. Find paragraph
        Paragraph paragraph = paragraphRepository.findById(command.paragraphId())
            .orElseThrow(() -> new IllegalArgumentException("Paragraph not found: " + command.paragraphId()));
        
        // 2. Update paragraph number (domain method - validates)
        paragraph.updateParagraphNumber(command.paragraphNumber());
        
        // 3. Save paragraph
        Paragraph savedParagraph = paragraphRepository.save(paragraph);
        
        // 4. Return result
        return ParagraphResult.from(savedParagraph);
    }
}

