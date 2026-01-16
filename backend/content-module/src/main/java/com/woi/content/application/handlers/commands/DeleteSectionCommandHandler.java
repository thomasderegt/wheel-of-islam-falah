package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteSectionCommand;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Command handler for deleting a section
 * 
 * Responsibilities:
 * - Validate that section exists
 * - Cascade delete: Delete all paragraphs in this section
 * - Delete section
 */
@Component
public class DeleteSectionCommandHandler {
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    
    public DeleteSectionCommandHandler(
            SectionRepository sectionRepository,
            ParagraphRepository paragraphRepository) {
        this.sectionRepository = sectionRepository;
        this.paragraphRepository = paragraphRepository;
    }
    
    public void handle(DeleteSectionCommand command) {
        // 1. Find section
        Section section = sectionRepository.findById(command.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + command.sectionId()));
        
        // 2. Cascade delete: Delete all paragraphs in this section
        List<Paragraph> paragraphs = paragraphRepository.findBySectionId(command.sectionId());
        for (Paragraph paragraph : paragraphs) {
            // TODO: Check if paragraph is used in Learning module before deleting
            paragraphRepository.delete(paragraph);
        }
        
        // 3. Delete section
        sectionRepository.delete(section);
    }
}

