package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetCategoryWithHierarchyQuery;
import com.woi.content.api.CategorySummary;
import com.woi.content.domain.entities.*;
import com.woi.content.domain.enums.ContentStatusType;
import com.woi.content.domain.repositories.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a category with complete hierarchy
 * 
 * Responsibilities:
 * - Load category with all children (books, chapters, sections, paragraphs)
 * - Load published versions for sections (or current if no published)
 * - Build complete hierarchy
 */
@Component
public class GetCategoryWithHierarchyQueryHandler {
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    private final SectionVersionRepository sectionVersionRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public GetCategoryWithHierarchyQueryHandler(
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
    
    public Optional<CategorySummary> handle(GetCategoryWithHierarchyQuery query) {
        // 1. Load category
        Optional<Category> categoryOpt = categoryRepository.findById(query.categoryId());
        if (categoryOpt.isEmpty()) {
            return Optional.empty();
        }
        Category category = categoryOpt.get();
        
        // 2. Load all books in category
        List<Book> books = bookRepository.findByCategoryId(category.getId());
        
        // 3. Build book summaries with hierarchy
        List<com.woi.content.api.BookSummary> bookSummaries = books.stream()
            .map(book -> buildBookSummary(book))
            .collect(Collectors.toList());
        
        // 4. Build category summary
        CategorySummary categorySummary = new CategorySummary(
            category.getId(),
            category.getTitleNl(),
            category.getTitleEn(),
            category.getSubtitleNl(),
            category.getSubtitleEn(),
            category.getDescriptionNl(),
            category.getDescriptionEn(),
            bookSummaries
        );
        
        return Optional.of(categorySummary);
    }
    
    private com.woi.content.api.BookSummary buildBookSummary(Book book) {
        // Load chapters
        List<Chapter> chapters = chapterRepository.findByBookId(book.getId());
        
        // Build chapter summaries
        List<com.woi.content.api.ChapterSummary> chapterSummaries = chapters.stream()
            .map(chapter -> buildChapterSummary(chapter))
            .collect(Collectors.toList());
        
        return new com.woi.content.api.BookSummary(
            book.getId(),
            book.getCategoryId(),
            book.getBookNumber(),
            chapterSummaries
        );
    }
    
    private com.woi.content.api.ChapterSummary buildChapterSummary(Chapter chapter) {
        // Load sections
        List<Section> sections = sectionRepository.findByChapterId(chapter.getId());
        
        // Build section summaries
        List<com.woi.content.api.SectionSummary> sectionSummaries = sections.stream()
            .map(section -> buildSectionSummary(section))
            .collect(Collectors.toList());
        
        return new com.woi.content.api.ChapterSummary(
            chapter.getId(),
            chapter.getBookId(),
            chapter.getChapterNumber(),
            chapter.getPosition(),
            sectionSummaries
        );
    }
    
    private com.woi.content.api.SectionSummary buildSectionSummary(Section section) {
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
        
        // Try to load published version first, then current version
        String titleEn = null;
        String titleNl = null;
        String introEn = null;
        String introNl = null;
        
        // Check if section has published status
        Optional<ContentStatus> statusOpt = contentStatusRepository.findByEntityTypeAndEntityId(
            section.getEntityTypeForStatus(),
            section.getId()
        );
        
        if (statusOpt.isPresent() && statusOpt.get().getStatus() == ContentStatusType.PUBLISHED) {
            // Load published version
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
        } else {
            // Load current version (fallback)
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

