package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Category;
import com.woi.content.infrastructure.persistence.entities.CategoryJpaEntity;

/**
 * Mapper between Category domain entity and CategoryJpaEntity
 */
public class CategoryEntityMapper {
    
    public static Category toDomain(CategoryJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Category category = new Category();
        category.setId(jpaEntity.getId());
        category.setCategoryNumber(jpaEntity.getCategoryNumber());
        category.setTitleNl(jpaEntity.getTitleNl());
        category.setTitleEn(jpaEntity.getTitleEn());
        category.setSubtitleNl(jpaEntity.getSubtitleNl());
        category.setSubtitleEn(jpaEntity.getSubtitleEn());
        category.setDescriptionNl(jpaEntity.getDescriptionNl());
        category.setDescriptionEn(jpaEntity.getDescriptionEn());
        category.setCreatedAt(jpaEntity.getCreatedAt());
        category.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return category;
    }
    
    public static CategoryJpaEntity toJpa(Category domain) {
        if (domain == null) {
            return null;
        }
        
        CategoryJpaEntity jpaEntity = new CategoryJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setCategoryNumber(domain.getCategoryNumber());
        jpaEntity.setTitleNl(domain.getTitleNl());
        jpaEntity.setTitleEn(domain.getTitleEn());
        jpaEntity.setSubtitleNl(domain.getSubtitleNl());
        jpaEntity.setSubtitleEn(domain.getSubtitleEn());
        jpaEntity.setDescriptionNl(domain.getDescriptionNl());
        jpaEntity.setDescriptionEn(domain.getDescriptionEn());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

