package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Category;
import com.woi.content.domain.repositories.CategoryRepository;
import com.woi.content.infrastructure.persistence.entities.CategoryJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.CategoryEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Category
 */
@Repository
public class CategoryRepositoryImpl implements CategoryRepository {
    
    private final CategoryJpaRepository jpaRepository;
    
    public CategoryRepositoryImpl(CategoryJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findById(Long id) {
        return jpaRepository.findById(id)
            .map(CategoryEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findByCategoryNumber(Integer categoryNumber) {
        return jpaRepository.findByCategoryNumber(categoryNumber)
            .map(CategoryEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return jpaRepository.findAll().stream()
            .map(CategoryEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findByWheelId(Long wheelId) {
        return jpaRepository.findByWheelId(wheelId).stream()
            .map(CategoryEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Category save(Category category) {
        CategoryJpaEntity jpaEntity = CategoryEntityMapper.toJpa(category);
        CategoryJpaEntity saved = jpaRepository.save(jpaEntity);
        return CategoryEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Category category) {
        jpaRepository.deleteById(category.getId());
    }
}

