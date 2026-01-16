package com.woi.content.infrastructure.api;

import com.woi.content.api.CategorySummary;
import com.woi.content.api.ContentModuleInterface;
import com.woi.content.api.SectionSummary;
import com.woi.content.application.handlers.queries.GetAllCategoriesQueryHandler;
import com.woi.content.application.handlers.queries.GetCategoryQueryHandler;
import com.woi.content.application.handlers.queries.GetCategoryWithHierarchyQueryHandler;
import com.woi.content.application.handlers.queries.GetPublicCategoriesQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionQueryHandler;
import com.woi.content.application.queries.GetAllCategoriesQuery;
import com.woi.content.application.queries.GetCategoryQuery;
import com.woi.content.application.queries.GetCategoryWithHierarchyQuery;
import com.woi.content.application.queries.GetPublicCategoriesQuery;
import com.woi.content.application.queries.GetSectionQuery;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.application.results.SectionResult;
import com.woi.content.domain.repositories.ParagraphRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of ContentModuleInterface
 * 
 * This is the public API for other modules to interact with content
 * Delegates to application layer handlers
 */
@Service
public class ContentModuleInterfaceImpl implements ContentModuleInterface {
    
    private final GetCategoryWithHierarchyQueryHandler getCategoryWithHierarchyHandler;
    private final GetPublicCategoriesQueryHandler getPublicCategoriesHandler;
    private final GetAllCategoriesQueryHandler getAllCategoriesHandler;
    private final GetCategoryQueryHandler getCategoryHandler;
    private final GetSectionQueryHandler getSectionHandler;
    private final ParagraphRepository paragraphRepository;
    
    public ContentModuleInterfaceImpl(
            GetCategoryWithHierarchyQueryHandler getCategoryWithHierarchyHandler,
            GetPublicCategoriesQueryHandler getPublicCategoriesHandler,
            GetAllCategoriesQueryHandler getAllCategoriesHandler,
            GetCategoryQueryHandler getCategoryHandler,
            GetSectionQueryHandler getSectionHandler,
            ParagraphRepository paragraphRepository) {
        this.getCategoryWithHierarchyHandler = getCategoryWithHierarchyHandler;
        this.getPublicCategoriesHandler = getPublicCategoriesHandler;
        this.getAllCategoriesHandler = getAllCategoriesHandler;
        this.getCategoryHandler = getCategoryHandler;
        this.getSectionHandler = getSectionHandler;
        this.paragraphRepository = paragraphRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CategorySummary> getAllCategoriesWithCompleteHierarchy() {
        // For now, use GetPublicCategoriesHandler logic but without filtering
        // TODO: Implement GetAllCategoriesWithHierarchyQueryHandler that includes all content
        // For v1, we'll use the public handler but this should be improved
        return getPublicCategoriesHandler.handle(new GetPublicCategoriesQuery());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CategorySummary> getPublicCategories() {
        GetPublicCategoriesQuery query = new GetPublicCategoriesQuery();
        return getPublicCategoriesHandler.handle(query);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CategorySummary> getCategoryByIdWithCompleteHierarchy(Long categoryId) {
        GetCategoryWithHierarchyQuery query = new GetCategoryWithHierarchyQuery(categoryId);
        return getCategoryWithHierarchyHandler.handle(query);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SectionSummary> getSectionById(Long id) {
        GetSectionQuery query = new GetSectionQuery(id);
        Optional<SectionResult> result = getSectionHandler.handle(query);
        
        if (result.isEmpty()) {
            return Optional.empty();
        }
        
        SectionResult sectionResult = result.get();
        // Build SectionSummary from SectionResult
        // Note: In v1, we don't have version data in SectionResult, so we'll need to load it separately
        // For now, return basic summary
        SectionSummary summary = new SectionSummary(
            sectionResult.id(),
            sectionResult.chapterId(),
            sectionResult.orderIndex(),
            null,  // titleEn - would need to load from version
            null,  // titleNl - would need to load from version
            null,  // introEn - would need to load from version
            null,  // introNl - would need to load from version
            null   // paragraphs - would need to load separately
        );
        
        return Optional.of(summary);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Long> getSectionIdForParagraph(Long paragraphId) {
        return paragraphRepository.findById(paragraphId)
            .map(p -> p.getSectionId());
    }
}

