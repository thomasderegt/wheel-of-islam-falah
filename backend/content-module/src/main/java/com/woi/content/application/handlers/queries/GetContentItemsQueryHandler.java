package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetBookCurrentVersionQuery;
import com.woi.content.application.queries.GetBooksByCategoryQuery;
import com.woi.content.application.queries.GetChapterCurrentVersionQuery;
import com.woi.content.application.queries.GetChaptersByBookQuery;
import com.woi.content.application.queries.GetContentItemsQuery;
import com.woi.content.application.queries.GetAllCategoriesQuery;
import com.woi.content.application.queries.GetParagraphsBySectionQuery;
import com.woi.content.application.queries.GetSectionsByChapterQuery;
import com.woi.content.application.results.ContentItemResult;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.application.results.BookResult;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.application.results.SectionResult;
import com.woi.content.application.results.ParagraphResult;
import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.ContentStatusRepository;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Builds a flat list of content items (books, chapters, sections, paragraphs) using
 * existing query handlers. Applies optional filters by type, categoryId, and bookId.
 */
@Component
public class GetContentItemsQueryHandler {

    private final GetAllCategoriesQueryHandler getAllCategoriesHandler;
    private final GetBooksByCategoryQueryHandler getBooksByCategoryHandler;
    private final GetBookCurrentVersionQueryHandler getBookCurrentVersionHandler;
    private final GetChaptersByBookQueryHandler getChaptersByBookHandler;
    private final GetChapterCurrentVersionQueryHandler getChapterCurrentVersionHandler;
    private final GetSectionsByChapterQueryHandler getSectionsByChapterHandler;
    private final GetParagraphsBySectionQueryHandler getParagraphsBySectionHandler;
    private final ContentStatusRepository contentStatusRepository;

    public GetContentItemsQueryHandler(
            GetAllCategoriesQueryHandler getAllCategoriesHandler,
            GetBooksByCategoryQueryHandler getBooksByCategoryHandler,
            GetBookCurrentVersionQueryHandler getBookCurrentVersionHandler,
            GetChaptersByBookQueryHandler getChaptersByBookHandler,
            GetChapterCurrentVersionQueryHandler getChapterCurrentVersionHandler,
            GetSectionsByChapterQueryHandler getSectionsByChapterHandler,
            GetParagraphsBySectionQueryHandler getParagraphsBySectionHandler,
            ContentStatusRepository contentStatusRepository) {
        this.getAllCategoriesHandler = getAllCategoriesHandler;
        this.getBooksByCategoryHandler = getBooksByCategoryHandler;
        this.getBookCurrentVersionHandler = getBookCurrentVersionHandler;
        this.getChaptersByBookHandler = getChaptersByBookHandler;
        this.getChapterCurrentVersionHandler = getChapterCurrentVersionHandler;
        this.getSectionsByChapterHandler = getSectionsByChapterHandler;
        this.getParagraphsBySectionHandler = getParagraphsBySectionHandler;
        this.contentStatusRepository = contentStatusRepository;
    }

    public List<ContentItemResult> handle(GetContentItemsQuery query) {
        List<ContentItemResult> items = new ArrayList<>();
        List<CategoryResult> categories = getAllCategoriesHandler.handle(new GetAllCategoriesQuery());

        for (CategoryResult category : categories) {
            if (query.categoryId() != null && !category.id().equals(query.categoryId())) {
                continue;
            }
            String categoryTitle = category.titleEn() != null ? category.titleEn() : (category.titleNl() != null ? category.titleNl() : "Category " + category.id());

            List<BookResult> books = getBooksByCategoryHandler.handle(new GetBooksByCategoryQuery(category.id()));
            for (BookResult book : books) {
                if (query.bookId() != null && !book.id().equals(query.bookId())) {
                    continue;
                }
                String bookTitle = resolveBookTitle(book.id());
                if (matchesType(query.type(), ContentItemResult.TYPE_BOOK)) {
                    items.add(new ContentItemResult(book.id(), ContentItemResult.TYPE_BOOK, bookTitle, categoryTitle, book.id(), category.id(), resolveStatus("book", book.id())));
                }

                List<ChapterResult> chapters = getChaptersByBookHandler.handle(new GetChaptersByBookQuery(book.id()));
                for (ChapterResult chapter : chapters) {
                    String chapterTitle = resolveChapterTitle(chapter.id());
                    if (matchesType(query.type(), ContentItemResult.TYPE_CHAPTER)) {
                        items.add(new ContentItemResult(chapter.id(), ContentItemResult.TYPE_CHAPTER, chapterTitle,
                                categoryTitle + " > " + bookTitle, book.id(), category.id(), resolveStatus("chapter", chapter.id())));
                    }

                    List<SectionResult> sections = getSectionsByChapterHandler.handle(new GetSectionsByChapterQuery(chapter.id()));
                    for (SectionResult section : sections) {
                        String sectionTitle = "Section " + section.orderIndex();
                        if (matchesType(query.type(), ContentItemResult.TYPE_SECTION)) {
                            items.add(new ContentItemResult(section.id(), ContentItemResult.TYPE_SECTION, sectionTitle,
                                    categoryTitle + " > " + bookTitle + " > " + chapterTitle, book.id(), category.id(), resolveStatus("section", section.id())));
                        }

                        List<ParagraphResult> paragraphs = getParagraphsBySectionHandler.handle(new GetParagraphsBySectionQuery(section.id()));
                        for (ParagraphResult paragraph : paragraphs) {
                            if (matchesType(query.type(), ContentItemResult.TYPE_PARAGRAPH)) {
                                String paragraphTitle = "Paragraph " + (paragraph.paragraphNumber() != null ? paragraph.paragraphNumber() : paragraph.id());
                                items.add(new ContentItemResult(paragraph.id(), ContentItemResult.TYPE_PARAGRAPH, paragraphTitle,
                                        categoryTitle + " > " + bookTitle + " > " + chapterTitle + " > " + sectionTitle, book.id(), category.id(), resolveStatus("paragraph", paragraph.id())));
                            }
                        }
                    }
                }
            }
        }
        return items;
    }

    private boolean matchesType(String filterType, String itemType) {
        return filterType == null || filterType.equals(itemType);
    }

    private String resolveBookTitle(Long bookId) {
        return getBookCurrentVersionHandler.handle(new GetBookCurrentVersionQuery(bookId))
                .map(v -> v.titleEn() != null ? v.titleEn() : (v.titleNl() != null ? v.titleNl() : "Book " + bookId))
                .orElse("Book " + bookId);
    }

    private String resolveChapterTitle(Long chapterId) {
        return getChapterCurrentVersionHandler.handle(new GetChapterCurrentVersionQuery(chapterId))
                .map(v -> v.titleEn() != null ? v.titleEn() : (v.titleNl() != null ? v.titleNl() : "Chapter " + chapterId))
                .orElse("Chapter " + chapterId);
    }

    private String resolveStatus(String entityType, Long entityId) {
        if (entityId == null) {
            return ContentStatusType.DRAFT.name();
        }
        String normalizedType = entityType != null ? entityType.toLowerCase() : entityType;
        Optional<ContentStatus> statusOpt = contentStatusRepository.findByEntityTypeAndEntityId(normalizedType, entityId);
        return statusOpt.map(cs -> cs.getStatus().name()).orElse(ContentStatusType.DRAFT.name());
    }
}
