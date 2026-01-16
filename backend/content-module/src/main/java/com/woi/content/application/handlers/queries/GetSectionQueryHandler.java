package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetSectionQuery;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.repositories.SectionRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a section by ID
 */
@Component
public class GetSectionQueryHandler {
    private final SectionRepository sectionRepository;
    
    public GetSectionQueryHandler(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }
    
    public Optional<SectionResult> handle(GetSectionQuery query) {
        return sectionRepository.findById(query.sectionId())
            .map(SectionResult::from);
    }
}

