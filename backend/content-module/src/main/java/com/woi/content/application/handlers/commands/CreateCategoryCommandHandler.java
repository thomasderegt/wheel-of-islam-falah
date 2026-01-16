package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateCategoryCommand;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.entities.Category;
import com.woi.content.domain.repositories.CategoryRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new category
 * 
 * Responsibilities:
 * - Orchestrate category creation
 * - Create ContentStatus with DRAFT status
 */
@Component
public class CreateCategoryCommandHandler {
    private final CategoryRepository categoryRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public CreateCategoryCommandHandler(
            CategoryRepository categoryRepository,
            ContentStatusRepository contentStatusRepository) {
        this.categoryRepository = categoryRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public CategoryResult handle(CreateCategoryCommand command) {
        // 1. Create category (domain factory method - validates and applies title fallback)
        Category category = Category.create(
            command.titleNl(),
            command.titleEn(),
            command.descriptionNl(),
            command.descriptionEn()
        );
        
        // 2. Save category
        Category savedCategory = categoryRepository.save(category);
        
        // 3. Create ContentStatus with DRAFT status
        com.woi.content.domain.entities.ContentStatus contentStatus = 
            com.woi.content.domain.entities.ContentStatus.create(
                savedCategory.getEntityTypeForStatus(),
                savedCategory.getId(),
                com.woi.content.domain.enums.ContentStatusType.DRAFT,
                null  // userId can be null for initial creation
            );
        contentStatusRepository.save(contentStatus);
        
        // 4. Return result
        return CategoryResult.from(savedCategory);
    }
}

