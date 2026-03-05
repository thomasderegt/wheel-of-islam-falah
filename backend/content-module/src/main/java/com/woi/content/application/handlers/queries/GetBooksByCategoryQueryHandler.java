package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBooksByCategoryQuery;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.BookVersion;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.BookVersionRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all books in a category with titles from working versions
 */
@Component
public class GetBooksByCategoryQueryHandler {
    private final BookRepository bookRepository;
    private final BookVersionRepository bookVersionRepository;

    public GetBooksByCategoryQueryHandler(BookRepository bookRepository,
            BookVersionRepository bookVersionRepository) {
        this.bookRepository = bookRepository;
        this.bookVersionRepository = bookVersionRepository;
    }

    public List<BookResult> handle(GetBooksByCategoryQuery query) {
        List<Book> books = bookRepository.findByCategoryId(query.categoryId());
        List<Long> versionIds = books.stream()
            .map(Book::getWorkingStatusBookVersionId)
            .filter(id -> id != null)
            .distinct()
            .toList();

        Map<Long, BookVersion> versionById = versionIds.isEmpty()
            ? Map.of()
            : bookVersionRepository.findAllById(versionIds).stream()
                .collect(Collectors.toMap(BookVersion::getId, v -> v));

        return books.stream()
            .map(book -> {
                BookVersion version = book.getWorkingStatusBookVersionId() != null
                    ? versionById.get(book.getWorkingStatusBookVersionId())
                    : null;
                // Fallback: if no version or version has no titles, try latest version
                if (version == null || (version.getTitleEn() == null && version.getTitleNl() == null)) {
                    version = bookVersionRepository.findLatestByBookId(book.getId()).orElse(version);
                }
                return BookResult.fromWithVersion(book, version);
            })
            .collect(Collectors.toList());
    }
}

