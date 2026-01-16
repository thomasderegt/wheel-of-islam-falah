package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetParagraphQuery;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.repositories.ParagraphRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a paragraph by ID
 */
@Component
public class GetParagraphQueryHandler {
    private final ParagraphRepository paragraphRepository;
    
    public GetParagraphQueryHandler(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }
    
    public Optional<ParagraphResult> handle(GetParagraphQuery query) {
        return paragraphRepository.findById(query.paragraphId())
            .map(ParagraphResult::from);
    }
}

