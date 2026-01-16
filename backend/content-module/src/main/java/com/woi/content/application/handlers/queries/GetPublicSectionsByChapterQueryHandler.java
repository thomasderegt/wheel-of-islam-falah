package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicSectionsByChapterQuery;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.domain.repositories.SectionRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all published sections in a chapter
 * Only returns sections with PUBLISHED status
 */
@Component
public class GetPublicSectionsByChapterQueryHandler {
    private final SectionRepository sectionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetPublicSectionsByChapterQueryHandler(
            SectionRepository sectionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.sectionRepository = sectionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public List<SectionResult> handle(GetPublicSectionsByChapterQuery query) {
        // Load all sections in chapter
        List<Section> sections = sectionRepository.findByChapterId(query.chapterId());
        
        // Filter to only include sections with PUBLISHED status
        return sections.stream()
            .filter(section -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository
                    .findByEntityTypeAndEntityId(section.getEntityTypeForStatus(), section.getId());
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .map(SectionResult::from)
            .collect(Collectors.toList());
    }
}


