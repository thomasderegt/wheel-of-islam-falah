package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateSectionCommand;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new section
 * 
 * Responsibilities:
 * - Orchestrate section creation
 * - Create ContentStatus with DRAFT status
 */
@Component
public class CreateSectionCommandHandler {
    private final SectionRepository sectionRepository;
    private final com.woi.content.domain.repositories.ContentStatusRepository contentStatusRepository;
    
    public CreateSectionCommandHandler(
            SectionRepository sectionRepository,
            com.woi.content.domain.repositories.ContentStatusRepository contentStatusRepository) {
        this.sectionRepository = sectionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public SectionResult handle(CreateSectionCommand command) {
        // 1. Create section (domain factory method - validates orderIndex)
        Section section = Section.create(command.chapterId(), command.orderIndex());
        
        // 2. Save section
        Section savedSection = sectionRepository.save(section);
        
        // 3. Create ContentStatus with DRAFT status
        com.woi.content.domain.entities.ContentStatus contentStatus = 
            com.woi.content.domain.entities.ContentStatus.create(
                savedSection.getEntityTypeForStatus(),
                savedSection.getId(),
                com.woi.content.domain.enums.ContentStatusType.DRAFT,
                null  // userId can be null for initial creation
            );
        contentStatusRepository.save(contentStatus);
        
        // 4. Return result
        return SectionResult.from(savedSection);
    }
}

