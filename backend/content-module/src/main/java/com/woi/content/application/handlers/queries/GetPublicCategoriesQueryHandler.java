package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetPublicCategoriesQuery;
import com.woi.content.api.CategorySummary;
import com.woi.content.domain.entities.*;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all public categories (only PUBLISHED content)
 * 
 * Responsibilities:
 * - Load all categories
 * - Filter to only include categories with PUBLISHED status
 * - Build hierarchy with only PUBLISHED content
 */
@Component
public class GetPublicCategoriesQueryHandler {
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    private final SectionVersionRepository sectionVersionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetPublicCategoriesQueryHandler(
            CategoryRepository categoryRepository,
            BookRepository bookRepository,
            ChapterRepository chapterRepository,
            SectionRepository sectionRepository,
            ParagraphRepository paragraphRepository,
            SectionVersionRepository sectionVersionRepository,
            ContentStatusRepository contentStatusRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.sectionRepository = sectionRepository;
        this.paragraphRepository = paragraphRepository;
        this.sectionVersionRepository = sectionVersionRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public List<CategorySummary> handle(GetPublicCategoriesQuery query) {
        // 1. Load all categories
        List<Category> categories = categoryRepository.findAll();
        
        // 2. Filter to only categories with PUBLISHED status and build summaries
        return categories.stream()
            .filter(category -> {
                Optional<ContentStatus> statusOpt = contentStatusRepository.findByEntityTypeAndEntityId(
                    category.getEntityTypeForStatus(),
                    category.getId()
                );
                return statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED;
            })
            .map(category -> buildPublicCategorySummary(category))
            .filter(category -> category != null)  // Filter out categories with no published content
            .collect(Collectors.toList());
    }
    
    private CategorySummary buildPublicCategorySummary(Category category) {
        // Load books
        List<Book> books = bookRepository.findByCategoryId(category.getId());
        
        // Build book summaries (only with published content)
        List<com.woi.content.api.BookSummary> bookSummaries = books.stream()
            .map(book -> buildPublicBookSummary(book))
            .filter(book -> book != null && !book.chapters().isEmpty())  // Only include books with published chapters
            .collect(Collectors.toList());
        
        // Only return category if it has published books
        if (bookSummaries.isEmpty()) {
            return null;
        }
        
        return new CategorySummary(
            category.getId(),
            category.getTitleNl(),
            category.getTitleEn(),
            category.getDescriptionNl(),
            category.getDescriptionEn(),
            bookSummaries
        );
    }
    
    private com.woi.content.api.BookSummary buildPublicBookSummary(Book book) {
        // Load chapters
        List<Chapter> chapters = chapterRepository.findByBookId(book.getId());
        
        // Build chapter summaries (only with published content)
        List<com.woi.content.api.ChapterSummary> chapterSummaries = chapters.stream()
            .map(chapter -> buildPublicChapterSummary(chapter))
            .filter(chapter -> chapter != null && !chapter.sections().isEmpty())  // Only include chapters with published sections
            .collect(Collectors.toList());
        
        // Only return book if it has published chapters
        if (chapterSummaries.isEmpty()) {
            return null;
        }
        
        return new com.woi.content.api.BookSummary(
            book.getId(),
            book.getCategoryId(),
            book.getBookNumber(),
            chapterSummaries
        );
    }
    
    private com.woi.content.api.ChapterSummary buildPublicChapterSummary(Chapter chapter) {
        // Load sections
        List<Section> sections = sectionRepository.findByChapterId(chapter.getId());
        
        // Build section summaries (only with published content)
        List<com.woi.content.api.SectionSummary> sectionSummaries = sections.stream()
            .map(section -> buildPublicSectionSummary(section))
            .filter(section -> section != null)  // Only include sections with published status
            .collect(Collectors.toList());
        
        // Only return chapter if it has published sections
        if (sectionSummaries.isEmpty()) {
            return null;
        }
        
        return new com.woi.content.api.ChapterSummary(
            chapter.getId(),
            chapter.getBookId(),
            chapter.getChapterNumber(),
            chapter.getPosition(),
            sectionSummaries
        );
    }
    
    private com.woi.content.api.SectionSummary buildPublicSectionSummary(Section section) {
        // Check if section has PUBLISHED status
        Optional<ContentStatus> statusOpt = contentStatusRepository.findByEntityTypeAndEntityId(
            section.getEntityTypeForStatus(),
            section.getId()
        );
        
        if (statusOpt.isEmpty() || statusOpt.get().getStatus() != ContentStatusType.PUBLISHED) {
            return null;  // Skip non-published sections
        }
        
        // Load paragraphs
        List<Paragraph> paragraphs = paragraphRepository.findBySectionId(section.getId());
        
        // Build paragraph summaries
        List<com.woi.content.api.ParagraphSummary> paragraphSummaries = paragraphs.stream()
            .map(p -> new com.woi.content.api.ParagraphSummary(
                p.getId(),
                p.getSectionId(),
                p.getParagraphNumber()
            ))
            .collect(Collectors.toList());
        
        // Load published version
        String titleEn = null;
        String titleNl = null;
        String introEn = null;
        String introNl = null;
        
        if (section.getWorkingStatusSectionVersionId() != null) {
            Optional<SectionVersion> versionOpt = sectionVersionRepository.findById(
                section.getWorkingStatusSectionVersionId()
            );
            if (versionOpt.isPresent()) {
                SectionVersion version = versionOpt.get();
                titleEn = version.getTitleEn();
                titleNl = version.getTitleNl();
                introEn = version.getIntroEn();
                introNl = version.getIntroNl();
            }
        }
        
        return new com.woi.content.api.SectionSummary(
            section.getId(),
            section.getChapterId(),
            section.getOrderIndex(),
            titleEn,
            titleNl,
            introEn,
            introNl,
            paragraphSummaries
        );
    }
}

