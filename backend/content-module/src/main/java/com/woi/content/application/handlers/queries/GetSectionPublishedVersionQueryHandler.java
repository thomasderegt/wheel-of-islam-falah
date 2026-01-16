package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetSectionPublishedVersionQuery;
import com.woi.content.application.results.SectionVersionResult;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.domain.repositories.SectionRepository;
import com.woi.content.domain.repositories.SectionVersionRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting the published version of a section
 * 
 * Note: In v1, we only check if status is PUBLISHED and return the latest version
 * In v2, we'll have approved version pointers
 */
@Component
public class GetSectionPublishedVersionQueryHandler {
    private final SectionRepository sectionRepository;
    private final SectionVersionRepository sectionVersionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetSectionPublishedVersionQueryHandler(
            SectionRepository sectionRepository,
            SectionVersionRepository sectionVersionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.sectionRepository = sectionRepository;
        this.sectionVersionRepository = sectionVersionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public Optional<SectionVersionResult> handle(GetSectionPublishedVersionQuery query) {
        // 1. Find section
        Section section = sectionRepository.findById(query.sectionId())
            .orElse(null);
        
        if (section == null) {
            return Optional.empty();
        }
        
        // 2. Check if section is published
        Optional<ContentStatus> statusOpt = contentStatusRepository
            .findByEntityTypeAndEntityId(section.getEntityTypeForStatus(), section.getId());
        
        if (statusOpt.isEmpty() || statusOpt.get().getStatus() != ContentStatusType.PUBLISHED) {
            return Optional.empty();
        }
        
        // 3. In v1, return the latest version (in v2, we'll use approved version pointer)
        return sectionVersionRepository.findLatestBySectionId(query.sectionId())
            .map(SectionVersionResult::from);
    }
}

