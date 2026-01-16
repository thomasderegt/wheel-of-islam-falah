package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetAllCategoriesQuery;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.repositories.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all categories
 */
@Component
public class GetAllCategoriesQueryHandler {
    private final CategoryRepository categoryRepository;
    
    public GetAllCategoriesQueryHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public List<CategoryResult> handle(GetAllCategoriesQuery query) {
        return categoryRepository.findAll().stream()
            .map(CategoryResult::from)
            .collect(Collectors.toList());
    }
}

