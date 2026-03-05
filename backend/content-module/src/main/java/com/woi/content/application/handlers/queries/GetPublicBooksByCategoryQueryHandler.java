package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicBooksByCategoryQuery;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.BookVersion;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.BookVersionRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all published books in a category with titles
 * Only returns books with PUBLISHED status
 */
@Component
public class GetPublicBooksByCategoryQueryHandler {
    private final BookRepository bookRepository;
    private final BookVersionRepository bookVersionRepository;
    private final ContentStatusRepository contentStatusRepository;

    public GetPublicBooksByCategoryQueryHandler(
            BookRepository bookRepository,
            BookVersionRepository bookVersionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.bookRepository = bookRepository;
        this.bookVersionRepository = bookVersionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }

    public List<BookResult> handle(GetPublicBooksByCategoryQuery query) {
        List<Book> books = bookRepository.findByCategoryId(query.categoryId());

        List<Book> publishedBooks = books.stream()
            .filter(book -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository
                    .findByEntityTypeAndEntityId(book.getEntityTypeForStatus(), book.getId());
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .toList();

        List<Long> versionIds = publishedBooks.stream()
            .map(Book::getWorkingStatusBookVersionId)
            .filter(id -> id != null)
            .distinct()
            .toList();

        Map<Long, BookVersion> versionById = versionIds.isEmpty()
            ? Map.of()
            : bookVersionRepository.findAllById(versionIds).stream()
                .collect(Collectors.toMap(BookVersion::getId, v -> v));

        return publishedBooks.stream()
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

