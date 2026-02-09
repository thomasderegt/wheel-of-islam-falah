package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for KanbanItem (database mapping)
 */
@Entity
@Table(name = "kanban_items", schema = "goals_okr")
public class KanbanItemJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Soft reference to users.users

    @Column(name = "item_type", nullable = false, length = 50)
    private String itemType; // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "column_name", nullable = false, length = 50)
    private String columnName; // TODO, IN_PROGRESS, IN_REVIEW, DONE

    @Column(name = "position", nullable = false)
    private Integer position;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "number", length = 50)
    private String number;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Public constructor for JPA
    public KanbanItemJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getColumnName() { return columnName; }
    public void setColumnName(String columnName) { this.columnName = columnName; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
