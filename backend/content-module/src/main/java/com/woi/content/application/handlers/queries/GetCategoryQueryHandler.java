package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetCategoryQuery;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.repositories.CategoryRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a category by ID
 */
@Component
public class GetCategoryQueryHandler {
    private final CategoryRepository categoryRepository;
    
    public GetCategoryQueryHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public Optional<CategoryResult> handle(GetCategoryQuery query) {
        return categoryRepository.findById(query.categoryId())
            .map(CategoryResult::from);
    }
}

