package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetCategoryByNumberQuery;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.repositories.CategoryRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a category by category number
 */
@Component
public class GetCategoryByNumberQueryHandler {
    private final CategoryRepository categoryRepository;
    
    public GetCategoryByNumberQueryHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public Optional<CategoryResult> handle(GetCategoryByNumberQuery query) {
        return categoryRepository.findByCategoryNumber(query.categoryNumber())
            .map(CategoryResult::from);
    }
}

