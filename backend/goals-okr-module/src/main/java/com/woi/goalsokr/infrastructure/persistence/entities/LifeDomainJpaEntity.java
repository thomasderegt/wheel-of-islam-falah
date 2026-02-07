package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for LifeDomain (database mapping)
 * Points to goals_okr.life_domains
 */
@Entity
@Table(name = "life_domains", schema = "goals_okr")
public class LifeDomainJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "domain_key", nullable = false, unique = true, length = 50)
    private String domainKey;
    
    @Column(name = "title_nl", nullable = false)
    private String titleNl;
    
    @Column(name = "title_en", nullable = false)
    private String titleEn;
    
    @Column(name = "description_nl", columnDefinition = "TEXT")
    private String descriptionNl;
    
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(name = "icon_name", length = 100)
    private String iconName;
    
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    
    @Column(name = "wheel_id")
    private Long wheelId; // FK to goals_okr.wheels
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Public constructor for JPA
    public LifeDomainJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDomainKey() { return domainKey; }
    public void setDomainKey(String domainKey) { this.domainKey = domainKey; }
    
    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getDescriptionNl() { return descriptionNl; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public Long getWheelId() { return wheelId; }
    public void setWheelId(Long wheelId) { this.wheelId = wheelId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
