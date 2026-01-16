package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetChaptersByBookQuery;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.domain.repositories.ChapterRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all chapters in a book
 */
@Component
public class GetChaptersByBookQueryHandler {
    private final ChapterRepository chapterRepository;
    
    public GetChaptersByBookQueryHandler(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }
    
    public List<ChapterResult> handle(GetChaptersByBookQuery query) {
        return chapterRepository.findByBookId(query.bookId()).stream()
            .map(ChapterResult::from)
            .collect(Collectors.toList());
    }
}

