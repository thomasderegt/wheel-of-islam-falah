package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBookQuery;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.repositories.BookRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a book by ID
 */
@Component
public class GetBookQueryHandler {
    private final BookRepository bookRepository;
    
    public GetBookQueryHandler(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    public Optional<BookResult> handle(GetBookQuery query) {
        return bookRepository.findById(query.bookId())
            .map(BookResult::from);
    }
}

