package com.woi.user.infrastructure.services;

import com.woi.user.domain.entities.AuditLog;
import com.woi.user.domain.repositories.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for audit logging
 * Logs security-related events for compliance and monitoring
 */
@Service
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    
    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    
    /**
     * Log a security event
     */
    @Transactional
    public void logEvent(
            Long userId,
            AuditLog.EventType eventType,
            AuditLog.EventStatus eventStatus,
            String ipAddress,
            String userAgent,
            String details) {
        
        AuditLog log = AuditLog.create(
            userId,
            eventType,
            eventStatus,
            ipAddress,
            userAgent,
            details
        );
        
        auditLogRepository.save(log);
    }
    
    /**
     * Log successful login
     */
    @Transactional
    public void logLoginSuccess(Long userId, String ipAddress, String userAgent) {
        logEvent(
            userId,
            AuditLog.EventType.LOGIN_SUCCESS,
            AuditLog.EventStatus.SUCCESS,
            ipAddress,
            userAgent,
            "User successfully logged in"
        );
    }
    
    /**
     * Log failed login attempt
     */
    @Transactional
    public void logLoginFailure(Long userId, String ipAddress, String userAgent, String reason) {
        logEvent(
            userId,
            AuditLog.EventType.LOGIN_FAILURE,
            AuditLog.EventStatus.FAILURE,
            ipAddress,
            userAgent,
            "Login failed: " + reason
        );
    }
    
    /**
     * Log password change
     */
    @Transactional
    public void logPasswordChange(Long userId, String ipAddress, String userAgent) {
        logEvent(
            userId,
            AuditLog.EventType.PASSWORD_CHANGE,
            AuditLog.EventStatus.SUCCESS,
            ipAddress,
            userAgent,
            "Password changed successfully"
        );
    }
    
    /**
     * Log account lockout
     */
    @Transactional
    public void logAccountLocked(Long userId, String ipAddress, String userAgent) {
        logEvent(
            userId,
            AuditLog.EventType.ACCOUNT_LOCKED,
            AuditLog.EventStatus.FAILURE,
            ipAddress,
            userAgent,
            "Account locked due to too many failed login attempts"
        );
    }
    
    /**
     * Log registration
     */
    @Transactional
    public void logRegistration(Long userId, String ipAddress, String userAgent) {
        logEvent(
            userId,
            AuditLog.EventType.REGISTRATION,
            AuditLog.EventStatus.SUCCESS,
            ipAddress,
            userAgent,
            "User registered successfully"
        );
    }
}

