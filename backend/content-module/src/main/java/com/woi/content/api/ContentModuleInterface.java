package com.woi.content.api;

import java.util.List;
import java.util.Optional;

/**
 * Public interface for Content module (v1)
 * This is the contract that other modules can use to interact with content
 * 
 * v1 Scope:
 * - Basic hierarchy queries
 * - Public/private content separation
 * - Section versioning only
 */
public interface ContentModuleInterface {
    
    /**
     * Get all categories with complete hierarchy
     * Returns all categories with their books, chapters, sections, and paragraphs
     * Includes both DRAFT and PUBLISHED content
     * 
     * @return List of all categories with their complete hierarchy
     */
    List<CategorySummary> getAllCategoriesWithCompleteHierarchy();
    
    /**
     * Get all categories with complete hierarchy (PUBLIC - only PUBLISHED content)
     * Returns only content that has been published (status = PUBLISHED)
     * No fallback to working versions - ensures students only see published content
     * 
     * @return List of categories with only published books, chapters, sections, and paragraphs
     */
    List<CategorySummary> getPublicCategories();
    
    /**
     * Get a specific category with complete hierarchy
     * Returns category with all books, chapters, sections, and paragraphs
     * Includes both DRAFT and PUBLISHED content
     * 
     * @param categoryId The ID of the category to retrieve
     * @return Optional containing the category if found
     */
    Optional<CategorySummary> getCategoryByIdWithCompleteHierarchy(Long categoryId);
    
    /**
     * Get section metadata by ID
     * Returns only structural metadata (id, chapter_id, order_index, version references)
     * Does NOT include content (content is in SectionVersion)
     * 
     * @param id Section ID
     * @return Optional containing section metadata if found
     */
    Optional<SectionSummary> getSectionById(Long id);
    
    /**
     * Get section ID for a paragraph
     * Used by other modules to find the parent section of a paragraph
     * 
     * @param paragraphId Paragraph ID
     * @return Optional containing the section ID if found
     */
    Optional<Long> getSectionIdForParagraph(Long paragraphId);
}

