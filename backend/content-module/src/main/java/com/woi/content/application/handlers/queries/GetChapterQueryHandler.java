package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetChapterQuery;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.domain.repositories.ChapterRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a chapter by ID
 */
@Component
public class GetChapterQueryHandler {
    private final ChapterRepository chapterRepository;
    
    public GetChapterQueryHandler(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }
    
    public Optional<ChapterResult> handle(GetChapterQuery query) {
        return chapterRepository.findById(query.chapterId())
            .map(ChapterResult::from);
    }
}

