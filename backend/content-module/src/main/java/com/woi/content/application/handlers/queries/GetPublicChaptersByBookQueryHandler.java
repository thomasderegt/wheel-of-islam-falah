package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicChaptersByBookQuery;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all published chapters in a book
 * Only returns chapters with PUBLISHED status
 */
@Component
public class GetPublicChaptersByBookQueryHandler {
    private final ChapterRepository chapterRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetPublicChaptersByBookQueryHandler(
            ChapterRepository chapterRepository,
            ContentStatusRepository contentStatusRepository) {
        this.chapterRepository = chapterRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public List<ChapterResult> handle(GetPublicChaptersByBookQuery query) {
        // Load all chapters in book
        List<Chapter> chapters = chapterRepository.findByBookId(query.bookId());
        
        // Filter to only include chapters with PUBLISHED status
        return chapters.stream()
            .filter(chapter -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository
                    .findByEntityTypeAndEntityId(chapter.getEntityTypeForStatus(), chapter.getId());
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .map(ChapterResult::from)
            .collect(Collectors.toList());
    }
}


