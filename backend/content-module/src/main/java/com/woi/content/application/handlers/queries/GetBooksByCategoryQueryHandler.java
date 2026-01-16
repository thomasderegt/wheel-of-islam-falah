package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBooksByCategoryQuery;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.repositories.BookRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all books in a category
 */
@Component
public class GetBooksByCategoryQueryHandler {
    private final BookRepository bookRepository;
    
    public GetBooksByCategoryQueryHandler(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    public List<BookResult> handle(GetBooksByCategoryQuery query) {
        return bookRepository.findByCategoryId(query.categoryId()).stream()
            .map(BookResult::from)
            .collect(Collectors.toList());
    }
}

