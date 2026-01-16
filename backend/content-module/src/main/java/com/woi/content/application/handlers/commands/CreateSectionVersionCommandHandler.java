package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateSectionVersionCommand;
import com.woi.content.application.results.SectionVersionResult;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.entities.SectionVersion;
import com.woi.content.domain.repositories.SectionRepository;
import com.woi.content.domain.repositories.SectionVersionRepository;
import com.woi.content.domain.services.VersionNumberGenerator;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new section version
 * 
 * Responsibilities:
 * - Generate version number
 * - Create section version (domain validates and applies title fallback)
 * - Update section's workingStatusSectionVersionId pointer
 */
@Component
public class CreateSectionVersionCommandHandler {
    private final SectionRepository sectionRepository;
    private final SectionVersionRepository sectionVersionRepository;
    private final VersionNumberGenerator versionNumberGenerator;
    
    public CreateSectionVersionCommandHandler(
            SectionRepository sectionRepository,
            SectionVersionRepository sectionVersionRepository,
            VersionNumberGenerator versionNumberGenerator) {
        this.sectionRepository = sectionRepository;
        this.sectionVersionRepository = sectionVersionRepository;
        this.versionNumberGenerator = versionNumberGenerator;
    }
    
    public SectionVersionResult handle(CreateSectionVersionCommand command) {
        // 1. Find section
        Section section = sectionRepository.findById(command.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + command.sectionId()));
        
        // 2. Generate next version number (domain service)
        Integer versionNumber = versionNumberGenerator.generateNextVersionNumber(command.sectionId());
        
        // 3. Create section version (domain factory method - validates and applies title fallback)
        SectionVersion version = SectionVersion.create(
            command.sectionId(),
            versionNumber,
            command.titleEn(),
            command.titleNl(),
            command.introEn(),
            command.introNl(),
            command.userId()
        );
        
        // 4. Save version
        SectionVersion savedVersion = sectionVersionRepository.save(version);
        
        // 5. Update section's workingStatusSectionVersionId pointer
        section.setWorkingStatusSectionVersionId(savedVersion.getId());
        sectionRepository.save(section);
        
        // 6. Return result
        return SectionVersionResult.from(savedVersion);
    }
}

