package com.woi.content.domain.enums;

/**
 * Review status types
 * Workflow: SUBMITTED → APPROVED/REJECTED
 */
public enum ReviewStatus {
    SUBMITTED,  // Review has been submitted, awaiting approval/rejection
    APPROVED,   // Review has been approved
    REJECTED    // Review has been rejected
}

