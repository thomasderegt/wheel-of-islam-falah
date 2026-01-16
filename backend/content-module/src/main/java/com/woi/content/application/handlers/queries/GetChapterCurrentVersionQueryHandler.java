package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetChapterCurrentVersionQuery;
import com.woi.content.application.results.ChapterVersionResult;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ChapterVersionRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting the current (working) version of a chapter
 */
@Component
public class GetChapterCurrentVersionQueryHandler {
    private final ChapterRepository chapterRepository;
    private final ChapterVersionRepository chapterVersionRepository;
    
    public GetChapterCurrentVersionQueryHandler(
            ChapterRepository chapterRepository,
            ChapterVersionRepository chapterVersionRepository) {
        this.chapterRepository = chapterRepository;
        this.chapterVersionRepository = chapterVersionRepository;
    }
    
    public Optional<ChapterVersionResult> handle(GetChapterCurrentVersionQuery query) {
        // 1. Find chapter
        Chapter chapter = chapterRepository.findById(query.chapterId())
            .orElse(null);
        
        if (chapter == null || chapter.getWorkingStatusChapterVersionId() == null) {
            return Optional.empty();
        }
        
        // 2. Find version by ID
        return chapterVersionRepository.findById(chapter.getWorkingStatusChapterVersionId())
            .map(ChapterVersionResult::from);
    }
}

