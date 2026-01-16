package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetSectionCurrentVersionQuery;
import com.woi.content.application.results.SectionVersionResult;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.SectionRepository;
import com.woi.content.domain.repositories.SectionVersionRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting the current (working) version of a section
 */
@Component
public class GetSectionCurrentVersionQueryHandler {
    private final SectionRepository sectionRepository;
    private final SectionVersionRepository sectionVersionRepository;
    
    public GetSectionCurrentVersionQueryHandler(
            SectionRepository sectionRepository,
            SectionVersionRepository sectionVersionRepository) {
        this.sectionRepository = sectionRepository;
        this.sectionVersionRepository = sectionVersionRepository;
    }
    
    public Optional<SectionVersionResult> handle(GetSectionCurrentVersionQuery query) {
        // 1. Find section
        Section section = sectionRepository.findById(query.sectionId())
            .orElse(null);
        
        if (section == null || section.getWorkingStatusSectionVersionId() == null) {
            return Optional.empty();
        }
        
        // 2. Find version by ID
        return sectionVersionRepository.findById(section.getWorkingStatusSectionVersionId())
            .map(SectionVersionResult::from);
    }
}

