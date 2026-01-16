package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.SectionVersionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for SectionVersionJpaEntity
 */
@Repository
public interface SectionVersionJpaRepository extends JpaRepository<SectionVersionJpaEntity, Long> {
    
    List<SectionVersionJpaEntity> findBySectionIdOrderByVersionNumberDesc(Long sectionId);
    
    Optional<SectionVersionJpaEntity> findBySectionIdAndVersionNumber(Long sectionId, Integer versionNumber);
    
    Optional<SectionVersionJpaEntity> findFirstBySectionIdOrderByVersionNumberDesc(Long sectionId);
}

