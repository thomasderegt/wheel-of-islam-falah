package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBookCurrentVersionQuery;
import com.woi.content.application.results.BookVersionResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.BookVersionRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting the current (working) version of a book
 */
@Component
public class GetBookCurrentVersionQueryHandler {
    private final BookRepository bookRepository;
    private final BookVersionRepository bookVersionRepository;
    
    public GetBookCurrentVersionQueryHandler(
            BookRepository bookRepository,
            BookVersionRepository bookVersionRepository) {
        this.bookRepository = bookRepository;
        this.bookVersionRepository = bookVersionRepository;
    }
    
    public Optional<BookVersionResult> handle(GetBookCurrentVersionQuery query) {
        // 1. Find book
        Book book = bookRepository.findById(query.bookId())
            .orElse(null);
        
        if (book == null || book.getWorkingStatusBookVersionId() == null) {
            return Optional.empty();
        }
        
        // 2. Find version by ID
        return bookVersionRepository.findById(book.getWorkingStatusBookVersionId())
            .map(BookVersionResult::from);
    }
}

