package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateSectionCommand;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating section metadata
 * 
 * Responsibilities:
 * - Update section orderIndex (domain validates)
 */
@Component
public class UpdateSectionCommandHandler {
    private final SectionRepository sectionRepository;
    
    public UpdateSectionCommandHandler(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }
    
    public SectionResult handle(UpdateSectionCommand command) {
        // 1. Find section
        Section section = sectionRepository.findById(command.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + command.sectionId()));
        
        // 2. Update orderIndex (domain method - validates)
        section.updateOrderIndex(command.orderIndex());
        
        // 3. Save section
        Section savedSection = sectionRepository.save(section);
        
        // 4. Return result
        return SectionResult.from(savedSection);
    }
}

