package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Category;

import java.util.List;
import java.util.Optional;

/**
 * Category repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface CategoryRepository {
    Optional<Category> findById(Long id);
    Optional<Category> findByCategoryNumber(Integer categoryNumber);
    List<Category> findAll();
    Category save(Category category);
    void delete(Category category);
}

