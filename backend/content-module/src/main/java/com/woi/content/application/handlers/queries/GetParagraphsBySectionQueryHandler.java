package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetParagraphsBySectionQuery;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.repositories.ParagraphRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all paragraphs in a section
 */
@Component
public class GetParagraphsBySectionQueryHandler {
    private final ParagraphRepository paragraphRepository;
    
    public GetParagraphsBySectionQueryHandler(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }
    
    public List<ParagraphResult> handle(GetParagraphsBySectionQuery query) {
        return paragraphRepository.findBySectionId(query.sectionId()).stream()
            .map(ParagraphResult::from)
            .collect(Collectors.toList());
    }
}

