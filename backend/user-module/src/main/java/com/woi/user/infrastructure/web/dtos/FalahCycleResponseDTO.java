package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Falah cycle response
 */
public class FalahCycleResponseDTO {
    private Long id;
    private Long userId;
    private LocalDateTime startedAt;
    private LocalDateTime flowExitedAt;
    private LocalDateTime completedAt;
    private boolean active;
    private boolean flowExited;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getFlowExitedAt() { return flowExitedAt; }
    public void setFlowExitedAt(LocalDateTime flowExitedAt) { this.flowExitedAt = flowExitedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isFlowExited() { return flowExited; }
    public void setFlowExited(boolean flowExited) { this.flowExited = flowExited; }
}
