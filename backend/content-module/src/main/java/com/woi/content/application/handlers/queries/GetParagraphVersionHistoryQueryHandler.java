package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetParagraphVersionHistoryQuery;
import com.woi.content.application.results.ParagraphVersionResult;
import com.woi.content.domain.repositories.ParagraphVersionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting version history of a paragraph
 */
@Component
public class GetParagraphVersionHistoryQueryHandler {
    private final ParagraphVersionRepository paragraphVersionRepository;
    
    public GetParagraphVersionHistoryQueryHandler(ParagraphVersionRepository paragraphVersionRepository) {
        this.paragraphVersionRepository = paragraphVersionRepository;
    }
    
    public List<ParagraphVersionResult> handle(GetParagraphVersionHistoryQuery query) {
        return paragraphVersionRepository.findByParagraphIdOrderByVersionNumberDesc(query.paragraphId()).stream()
            .map(ParagraphVersionResult::from)
            .collect(Collectors.toList());
    }
}

