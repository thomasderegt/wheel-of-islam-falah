package com.woi.content.infrastructure.persistence.mappers;

import com.woi.content.domain.entities.Book;
import com.woi.content.infrastructure.persistence.entities.BookJpaEntity;

/**
 * Mapper between Book domain entity and BookJpaEntity
 */
public class BookEntityMapper {
    
    public static Book toDomain(BookJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        Book book = new Book();
        book.setId(jpaEntity.getId());
        book.setCategoryId(jpaEntity.getCategoryId());
        book.setBookNumberInternal(jpaEntity.getBookNumber());
        book.setWorkingStatusBookVersionId(jpaEntity.getWorkingStatusBookVersionId());
        book.setCreatedAt(jpaEntity.getCreatedAt());
        book.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return book;
    }
    
    public static BookJpaEntity toJpa(Book domain) {
        if (domain == null) {
            return null;
        }
        
        BookJpaEntity jpaEntity = new BookJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setCategoryId(domain.getCategoryId());
        jpaEntity.setBookNumber(domain.getBookNumber());
        jpaEntity.setWorkingStatusBookVersionId(domain.getWorkingStatusBookVersionId());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}

