package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicParagraphsBySectionQuery;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.domain.repositories.ParagraphRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all published paragraphs in a section
 * Only returns paragraphs with PUBLISHED status
 */
@Component
public class GetPublicParagraphsBySectionQueryHandler {
    private final ParagraphRepository paragraphRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetPublicParagraphsBySectionQueryHandler(
            ParagraphRepository paragraphRepository,
            ContentStatusRepository contentStatusRepository) {
        this.paragraphRepository = paragraphRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public List<ParagraphResult> handle(GetPublicParagraphsBySectionQuery query) {
        // Load all paragraphs in section
        List<Paragraph> paragraphs = paragraphRepository.findBySectionId(query.sectionId());
        
        // Filter to only include paragraphs with PUBLISHED status
        return paragraphs.stream()
            .filter(paragraph -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository
                    .findByEntityTypeAndEntityId(paragraph.getEntityTypeForStatus(), paragraph.getId());
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .map(ParagraphResult::from)
            .collect(Collectors.toList());
    }
}


