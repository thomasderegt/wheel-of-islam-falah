package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for Initiative (template) - database mapping
 */
@Entity
@Table(name = "initiatives", schema = "goals_okr")
public class InitiativeJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "key_result_id", nullable = false)
    private Long keyResultId; // FK to goals_okr.key_results

    @Column(name = "title_nl", nullable = false)
    private String titleNl;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "description_nl", columnDefinition = "TEXT")
    private String descriptionNl;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "learning_flow_template_id")
    private Long learningFlowTemplateId; // Optional - Soft reference to learning.learning_flow_templates

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Public constructor for JPA
    public InitiativeJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getKeyResultId() { return keyResultId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }

    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getDescriptionNl() { return descriptionNl; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }

    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }

    public Long getLearningFlowTemplateId() { return learningFlowTemplateId; }
    public void setLearningFlowTemplateId(Long learningFlowTemplateId) { this.learningFlowTemplateId = learningFlowTemplateId; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
