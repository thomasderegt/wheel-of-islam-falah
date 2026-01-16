package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetSectionsByChapterQuery;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.repositories.SectionRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all sections in a chapter
 */
@Component
public class GetSectionsByChapterQueryHandler {
    private final SectionRepository sectionRepository;
    
    public GetSectionsByChapterQueryHandler(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }
    
    public List<SectionResult> handle(GetSectionsByChapterQuery query) {
        return sectionRepository.findByChapterId(query.chapterId()).stream()
            .map(SectionResult::from)
            .collect(Collectors.toList());
    }
}

