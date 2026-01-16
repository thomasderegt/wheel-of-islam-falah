package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.CompleteEnrollmentCommand;
import com.woi.learning.domain.entities.LearningFlowEnrollment;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a learning flow enrollment
 */
@Component
public class CompleteEnrollmentCommandHandler {
    private final LearningFlowEnrollmentRepository enrollmentRepository;
    
    public CompleteEnrollmentCommandHandler(LearningFlowEnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    
    @Transactional
    public void handle(CompleteEnrollmentCommand command) {
        // Find enrollment
        LearningFlowEnrollment enrollment = enrollmentRepository.findById(command.enrollmentId())
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + command.enrollmentId()));
        
        // Mark as completed (domain method validates)
        enrollment.markCompleted();
        
        // Save enrollment
        enrollmentRepository.save(enrollment);
    }
}

