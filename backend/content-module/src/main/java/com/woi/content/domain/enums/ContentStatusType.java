package com.woi.content.domain.enums;

/**
 * Content status types
 * v1: DRAFT and PUBLISHED
 * v2: Added IN_REVIEW, NEEDS_REVISION, APPROVED for review workflow
 */
public enum ContentStatusType {
    DRAFT,          // Content is being created/edited
    PUBLISHED,      // Content is published and visible to students
    IN_REVIEW,      // Content has been submitted for review
    NEEDS_REVISION, // Content was rejected and needs revision
    APPROVED        // Content has been approved but not yet published
}

