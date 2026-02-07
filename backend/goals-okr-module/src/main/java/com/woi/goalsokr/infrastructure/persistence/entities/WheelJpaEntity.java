package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for Wheel (database mapping)
 * Points to goals_okr.wheels
 */
@Entity
@Table(name = "wheels", schema = "goals_okr")
public class WheelJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "wheel_key", nullable = false, unique = true, length = 50)
    private String wheelKey;
    
    @Column(name = "name_nl", nullable = false)
    private String nameNl;
    
    @Column(name = "name_en", nullable = false)
    private String nameEn;
    
    @Column(name = "description_nl", columnDefinition = "TEXT")
    private String descriptionNl;
    
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Public constructor for JPA
    public WheelJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getWheelKey() { return wheelKey; }
    public void setWheelKey(String wheelKey) { this.wheelKey = wheelKey; }
    
    public String getNameNl() { return nameNl; }
    public void setNameNl(String nameNl) { this.nameNl = nameNl; }
    
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    
    public String getDescriptionNl() { return descriptionNl; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
