package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.PublishSectionCommand;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for publishing a section (DRAFT → PUBLISHED)
 * 
 * Responsibilities:
 * - Update ContentStatus from DRAFT to PUBLISHED
 */
@Component
public class PublishSectionCommandHandler {
    private final SectionRepository sectionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public PublishSectionCommandHandler(
            SectionRepository sectionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.sectionRepository = sectionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public void handle(PublishSectionCommand command) {
        // 1. Find section
        Section section = sectionRepository.findById(command.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + command.sectionId()));
        
        // 2. Find or create ContentStatus
        ContentStatus contentStatus = contentStatusRepository
            .findByEntityTypeAndEntityId(section.getEntityTypeForStatus(), section.getId())
            .orElseGet(() -> {
                // Create new ContentStatus if it doesn't exist
                return ContentStatus.create(
                    section.getEntityTypeForStatus(),
                    section.getId(),
                    ContentStatusType.DRAFT,
                    null
                );
            });
        
        // 3. Update status to PUBLISHED (domain method)
        contentStatus.updateStatus(ContentStatusType.PUBLISHED, command.userId());
        
        // 4. Save ContentStatus
        contentStatusRepository.save(contentStatus);
    }
}

