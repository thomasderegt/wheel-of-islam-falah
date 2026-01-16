package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateCategoryCommand;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.entities.Category;
import com.woi.content.domain.repositories.CategoryRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating category content
 * 
 * Responsibilities:
 * - Update category titles and descriptions (domain validates and applies fallback)
 */
@Component
public class UpdateCategoryCommandHandler {
    private final CategoryRepository categoryRepository;
    
    public UpdateCategoryCommandHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public CategoryResult handle(UpdateCategoryCommand command) {
        // 1. Find category
        Category category = categoryRepository.findById(command.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Category not found: " + command.categoryId()));
        
        // 2. Update content (domain method - validates and applies title fallback)
        category.updateContent(
            command.titleNl(),
            command.titleEn(),
            command.descriptionNl(),
            command.descriptionEn()
        );
        
        // 3. Save category
        Category savedCategory = categoryRepository.save(category);
        
        // 4. Return result
        return CategoryResult.from(savedCategory);
    }
}

