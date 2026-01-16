package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.ReviewJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for ReviewJpaEntity
 */
@Repository
public interface ReviewJpaRepository extends JpaRepository<ReviewJpaEntity, Long> {
    
    List<ReviewJpaEntity> findByReviewableItemId(Long reviewableItemId);
    
    List<ReviewJpaEntity> findByStatus(String status);
    
    @Query("SELECT r FROM ReviewJpaEntity r " +
           "JOIN ReviewableItemJpaEntity ri ON r.reviewableItemId = ri.id " +
           "WHERE ri.type = :type AND ri.referenceId = :referenceId AND r.status = 'APPROVED' " +
           "ORDER BY r.updatedAt DESC")
    Optional<ReviewJpaEntity> findApprovedReviewByTypeAndReferenceId(
        @Param("type") String type,
        @Param("referenceId") Long referenceId
    );
    
    @Query("SELECT r FROM ReviewJpaEntity r " +
           "JOIN ReviewableItemJpaEntity ri ON r.reviewableItemId = ri.id " +
           "WHERE ri.type = :type AND ri.referenceId = :referenceId " +
           "ORDER BY r.createdAt DESC")
    List<ReviewJpaEntity> findByTypeAndReferenceId(
        @Param("type") String type,
        @Param("referenceId") Long referenceId
    );
}

