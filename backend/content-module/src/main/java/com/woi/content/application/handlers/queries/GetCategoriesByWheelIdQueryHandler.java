package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetCategoriesByWheelIdQuery;
import com.woi.content.application.results.CategoryResult;
import com.woi.content.domain.repositories.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting categories by wheel ID
 */
@Component
public class GetCategoriesByWheelIdQueryHandler {
    private final CategoryRepository categoryRepository;
    
    public GetCategoriesByWheelIdQueryHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public List<CategoryResult> handle(GetCategoriesByWheelIdQuery query) {
        return categoryRepository.findByWheelId(query.wheelId()).stream()
            .map(CategoryResult::from)
            .collect(Collectors.toList());
    }
}
