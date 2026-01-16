package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetSectionVersionHistoryQuery;
import com.woi.content.application.results.SectionVersionResult;
import com.woi.content.domain.repositories.SectionVersionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting version history of a section
 */
@Component
public class GetSectionVersionHistoryQueryHandler {
    private final SectionVersionRepository sectionVersionRepository;
    
    public GetSectionVersionHistoryQueryHandler(SectionVersionRepository sectionVersionRepository) {
        this.sectionVersionRepository = sectionVersionRepository;
    }
    
    public List<SectionVersionResult> handle(GetSectionVersionHistoryQuery query) {
        return sectionVersionRepository.findBySectionIdOrderByVersionNumberDesc(query.sectionId()).stream()
            .map(SectionVersionResult::from)
            .collect(Collectors.toList());
    }
}

