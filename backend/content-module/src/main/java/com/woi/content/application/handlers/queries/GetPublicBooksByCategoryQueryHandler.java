package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicBooksByCategoryQuery;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all published books in a category
 * Only returns books with PUBLISHED status
 */
@Component
public class GetPublicBooksByCategoryQueryHandler {
    private final BookRepository bookRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetPublicBooksByCategoryQueryHandler(
            BookRepository bookRepository,
            ContentStatusRepository contentStatusRepository) {
        this.bookRepository = bookRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public List<BookResult> handle(GetPublicBooksByCategoryQuery query) {
        // Load all books in category
        List<Book> books = bookRepository.findByCategoryId(query.categoryId());
        
        // Filter to only include books with PUBLISHED status
        return books.stream()
            .filter(book -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository
                    .findByEntityTypeAndEntityId(book.getEntityTypeForStatus(), book.getId());
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .map(BookResult::from)
            .collect(Collectors.toList());
    }
}

