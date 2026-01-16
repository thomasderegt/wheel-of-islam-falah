package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBookVersionHistoryQuery;
import com.woi.content.application.results.BookVersionResult;
import com.woi.content.domain.repositories.BookVersionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting version history of a book
 */
@Component
public class GetBookVersionHistoryQueryHandler {
    private final BookVersionRepository bookVersionRepository;
    
    public GetBookVersionHistoryQueryHandler(BookVersionRepository bookVersionRepository) {
        this.bookVersionRepository = bookVersionRepository;
    }
    
    public List<BookVersionResult> handle(GetBookVersionHistoryQuery query) {
        return bookVersionRepository.findByBookIdOrderByVersionNumberDesc(query.bookId()).stream()
            .map(BookVersionResult::from)
            .collect(Collectors.toList());
    }
}

