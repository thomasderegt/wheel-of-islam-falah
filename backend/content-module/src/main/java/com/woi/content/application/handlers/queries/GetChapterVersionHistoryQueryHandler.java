package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetChapterVersionHistoryQuery;
import com.woi.content.application.results.ChapterVersionResult;
import com.woi.content.domain.repositories.ChapterVersionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting version history of a chapter
 */
@Component
public class GetChapterVersionHistoryQueryHandler {
    private final ChapterVersionRepository chapterVersionRepository;
    
    public GetChapterVersionHistoryQueryHandler(ChapterVersionRepository chapterVersionRepository) {
        this.chapterVersionRepository = chapterVersionRepository;
    }
    
    public List<ChapterVersionResult> handle(GetChapterVersionHistoryQuery query) {
        return chapterVersionRepository.findByChapterIdOrderByVersionNumberDesc(query.chapterId()).stream()
            .map(ChapterVersionResult::from)
            .collect(Collectors.toList());
    }
}

