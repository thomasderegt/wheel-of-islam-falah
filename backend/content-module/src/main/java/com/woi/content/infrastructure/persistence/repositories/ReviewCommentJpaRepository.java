package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ReviewCommentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for ReviewCommentJpaEntity
 */
@Repository
public interface ReviewCommentJpaRepository extends JpaRepository<ReviewCommentJpaEntity, Long> {
    
    List<ReviewCommentJpaEntity> findByReviewId(Long reviewId);
    
    @Modifying
    @Query("DELETE FROM ReviewCommentJpaEntity rc WHERE rc.reviewId = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);
}

