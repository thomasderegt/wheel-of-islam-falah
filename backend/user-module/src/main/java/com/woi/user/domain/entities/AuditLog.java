package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * AuditLog domain entity - Pure POJO (no JPA annotations)
 * Tracks security-related events for compliance and security monitoring
 */
public class AuditLog {
    
    public enum EventType {
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        PASSWORD_CHANGE,
        PASSWORD_RESET,
        ACCOUNT_LOCKED,
        ACCOUNT_UNLOCKED,
        REGISTRATION
    }
    
    public enum EventStatus {
        SUCCESS,
        FAILURE
    }
    
    private Long id;
    private Long userId;
    private EventType eventType;
    private EventStatus eventStatus;
    private String ipAddress;
    private String userAgent;
    private String details;
    private LocalDateTime createdAt;
    
    // Private constructor
    private AuditLog() {}
    
    /**
     * Factory method: Create a new audit log entry
     * 
     * @param userId User ID (can be null for failed login attempts)
     * @param eventType Type of event
     * @param eventStatus Status of event (SUCCESS or FAILURE)
     * @param ipAddress IP address of the request
     * @param userAgent User agent of the request
     * @param details Additional details about the event
     * @return New AuditLog instance
     * @throws IllegalArgumentException if eventType or eventStatus is null
     */
    public static AuditLog create(
            Long userId,
            EventType eventType,
            EventStatus eventStatus,
            String ipAddress,
            String userAgent,
            String details) {
        if (eventType == null) {
            throw new IllegalArgumentException("Event type cannot be null");
        }
        if (eventStatus == null) {
            throw new IllegalArgumentException("Event status cannot be null");
        }
        
        AuditLog log = new AuditLog();
        log.userId = userId;
        log.eventType = eventType;
        log.eventStatus = eventStatus;
        log.ipAddress = ipAddress;
        log.userAgent = userAgent;
        log.details = details;
        log.createdAt = LocalDateTime.now();
        return log;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public EventType getEventType() { return eventType; }
    public EventStatus getEventStatus() { return eventStatus; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }
    public String getDetails() { return details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for createdAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

