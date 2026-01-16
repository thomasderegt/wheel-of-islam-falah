package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateParagraphCommand;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.domain.repositories.SectionRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new paragraph
 * 
 * Responsibilities:
 * - Orchestrate paragraph creation
 * - Validate section exists
 * - Create ContentStatus with DRAFT status
 */
@Component
public class CreateParagraphCommandHandler {
    private final ParagraphRepository paragraphRepository;
    private final SectionRepository sectionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public CreateParagraphCommandHandler(
            ParagraphRepository paragraphRepository,
            SectionRepository sectionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.paragraphRepository = paragraphRepository;
        this.sectionRepository = sectionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public ParagraphResult handle(CreateParagraphCommand command) {
        // 1. Validate section exists
        sectionRepository.findById(command.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + command.sectionId()));
        
        // 2. Create paragraph (domain factory method - validates sectionId and paragraphNumber)
        Paragraph paragraph = Paragraph.create(command.sectionId(), command.paragraphNumber());
        
        // 3. Save paragraph
        Paragraph savedParagraph = paragraphRepository.save(paragraph);
        
        // 4. Create ContentStatus with DRAFT status
        com.woi.content.domain.entities.ContentStatus contentStatus = 
            com.woi.content.domain.entities.ContentStatus.create(
                savedParagraph.getEntityTypeForStatus(),
                savedParagraph.getId(),
                com.woi.content.domain.enums.ContentStatusType.DRAFT,
                null  // userId can be null for initial creation
            );
        contentStatusRepository.save(contentStatus);
        
        // 5. Return result
        return ParagraphResult.from(savedParagraph);
    }
}

