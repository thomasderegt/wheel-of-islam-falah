package com.woi.learning.infrastructure.persistence.entities;

import jakarta.persistence.*;

/**
 * JPA entity for LearningFlowStep (database mapping)
 */
@Entity
@Table(name = "learning_flow_steps", schema = "learning")
public class LearningFlowStepJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "template_id", nullable = false)
    private Long templateId; // FK to learning_flow_templates
    
    @Column(name = "paragraph_id", nullable = false)
    private Long paragraphId; // Soft reference to content.paragraphs (no FK)
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    // Public constructor for JPA
    public LearningFlowStepJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    
    public Long getParagraphId() { return paragraphId; }
    public void setParagraphId(Long paragraphId) { this.paragraphId = paragraphId; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
}

