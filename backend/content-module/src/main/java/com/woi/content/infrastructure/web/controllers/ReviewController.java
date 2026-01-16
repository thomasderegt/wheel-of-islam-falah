package com.woi.content.infrastructure.web.controllers;

import com.woi.content.application.commands.AddReviewCommentCommand;
import com.woi.content.application.commands.ApproveReviewCommand;
import com.woi.content.application.commands.DeleteReviewCommentCommand;
import com.woi.content.application.commands.RejectReviewCommand;
import com.woi.content.application.commands.SubmitForReviewCommand;
import com.woi.content.application.commands.UpdateReviewCommentCommand;
import com.woi.content.application.handlers.commands.AddReviewCommentCommandHandler;
import com.woi.content.application.handlers.commands.ApproveReviewCommandHandler;
import com.woi.content.application.handlers.commands.DeleteReviewCommentCommandHandler;
import com.woi.content.application.handlers.commands.RejectReviewCommandHandler;
import com.woi.content.application.handlers.commands.SubmitForReviewCommandHandler;
import com.woi.content.application.handlers.commands.UpdateReviewCommentCommandHandler;
import com.woi.content.application.handlers.queries.GetReviewCommentsQueryHandler;
import com.woi.content.application.handlers.queries.GetReviewQueryHandler;
import com.woi.content.application.handlers.queries.GetReviewsByReviewableItemQueryHandler;
import com.woi.content.application.handlers.queries.GetReviewsByStatusQueryHandler;
import com.woi.content.application.queries.GetReviewCommentsQuery;
import com.woi.content.application.queries.GetReviewQuery;
import com.woi.content.application.queries.GetReviewsByReviewableItemQuery;
import com.woi.content.application.queries.GetReviewsByStatusQuery;
import com.woi.content.domain.enums.ReviewStatus;
import com.woi.content.domain.enums.ReviewableType;
import com.woi.content.infrastructure.web.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST Controller for Review Workflow
 * v2: Review endpoints for submitting, approving, and rejecting reviews
 */
@RestController
@RequestMapping("/api/v2/content/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    private final SubmitForReviewCommandHandler submitForReviewHandler;
    private final ApproveReviewCommandHandler approveReviewHandler;
    private final RejectReviewCommandHandler rejectReviewHandler;
    private final GetReviewQueryHandler getReviewHandler;
    private final GetReviewsByStatusQueryHandler getReviewsByStatusHandler;
    private final GetReviewsByReviewableItemQueryHandler getReviewsByReviewableItemHandler;
    private final AddReviewCommentCommandHandler addReviewCommentHandler;
    private final GetReviewCommentsQueryHandler getReviewCommentsHandler;
    private final UpdateReviewCommentCommandHandler updateReviewCommentHandler;
    private final DeleteReviewCommentCommandHandler deleteReviewCommentHandler;
    
    public ReviewController(
            SubmitForReviewCommandHandler submitForReviewHandler,
            ApproveReviewCommandHandler approveReviewHandler,
            RejectReviewCommandHandler rejectReviewHandler,
            GetReviewQueryHandler getReviewHandler,
            GetReviewsByStatusQueryHandler getReviewsByStatusHandler,
            GetReviewsByReviewableItemQueryHandler getReviewsByReviewableItemHandler,
            AddReviewCommentCommandHandler addReviewCommentHandler,
            GetReviewCommentsQueryHandler getReviewCommentsHandler,
            UpdateReviewCommentCommandHandler updateReviewCommentHandler,
            DeleteReviewCommentCommandHandler deleteReviewCommentHandler) {
        this.submitForReviewHandler = submitForReviewHandler;
        this.approveReviewHandler = approveReviewHandler;
        this.rejectReviewHandler = rejectReviewHandler;
        this.getReviewHandler = getReviewHandler;
        this.getReviewsByStatusHandler = getReviewsByStatusHandler;
        this.getReviewsByReviewableItemHandler = getReviewsByReviewableItemHandler;
        this.addReviewCommentHandler = addReviewCommentHandler;
        this.getReviewCommentsHandler = getReviewCommentsHandler;
        this.updateReviewCommentHandler = updateReviewCommentHandler;
        this.deleteReviewCommentHandler = deleteReviewCommentHandler;
    }
    
    /**
     * Submit content for review
     * POST /api/v2/content/reviews/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitForReview(
            @Valid @RequestBody SubmitForReviewRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Validation failed", "details", bindingResult.getAllErrors()));
        }
        
        try {
            ReviewableType type = ReviewableType.valueOf(request.type().toUpperCase());
            ReviewDTO dto = ReviewDTO.from(submitForReviewHandler.handle(
                new SubmitForReviewCommand(
                    type,
                    request.referenceId(),
                    request.versionId(),
                    request.submittedBy(),
                    request.comment()
                )
            ));
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het indienen voor review."));
        }
    }
    
    /**
     * Approve a review
     * POST /api/v2/content/reviews/{id}/approve
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveReview(
            @PathVariable Long id,
            @Valid @RequestBody ApproveReviewRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Validation failed", "details", bindingResult.getAllErrors()));
        }
        
        try {
            ReviewDTO dto = ReviewDTO.from(approveReviewHandler.handle(
                new ApproveReviewCommand(id, request.reviewedBy(), request.comment())
            ));
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het goedkeuren van de review."));
        }
    }
    
    /**
     * Reject a review
     * POST /api/v2/content/reviews/{id}/reject
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectReview(
            @PathVariable Long id,
            @Valid @RequestBody RejectReviewRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Validation failed", "details", bindingResult.getAllErrors()));
        }
        
        try {
            ReviewDTO dto = ReviewDTO.from(rejectReviewHandler.handle(
                new RejectReviewCommand(id, request.reviewedBy(), request.comment())
            ));
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het afwijzen van de review."));
        }
    }
    
    /**
     * Get a review by ID
     * GET /api/v2/content/reviews/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReview(@PathVariable Long id) {
        Optional<com.woi.content.application.results.ReviewResult> result = 
            getReviewHandler.handle(new GetReviewQuery(id));
        
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(ReviewDTO.from(result.get()));
    }
    
    /**
     * Get reviews by status
     * GET /api/v2/content/reviews/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getReviewsByStatus(@PathVariable String status) {
        try {
            ReviewStatus reviewStatus = ReviewStatus.valueOf(status.toUpperCase());
            List<ReviewDTO> dtos = getReviewsByStatusHandler.handle(
                new GetReviewsByStatusQuery(reviewStatus)
            ).stream()
                .map(ReviewDTO::from)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid status: " + status));
        }
    }
    
    /**
     * Get reviews by reviewable item
     * GET /api/v2/content/reviews/item?type={type}&referenceId={referenceId}
     */
    @GetMapping("/item")
    public ResponseEntity<?> getReviewsByReviewableItem(
            @RequestParam String type,
            @RequestParam Long referenceId) {
        try {
            ReviewableType reviewableType = ReviewableType.valueOf(type.toUpperCase());
            List<ReviewDTO> dtos = getReviewsByReviewableItemHandler.handle(
                new GetReviewsByReviewableItemQuery(reviewableType, referenceId)
            ).stream()
                .map(ReviewDTO::from)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid type: " + type));
        }
    }
    
    // ========== Review Comments Endpoints ==========
    
    /**
     * Add a comment to a specific field of a review
     * POST /api/v2/content/reviews/{reviewId}/comments
     */
    @PostMapping("/{reviewId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long reviewId,
            @Valid @RequestBody AddReviewCommentRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Validation failed", "details", bindingResult.getAllErrors()));
        }
        
        try {
            ReviewCommentDTO dto = ReviewCommentDTO.from(addReviewCommentHandler.handle(
                new AddReviewCommentCommand(
                    reviewId,
                    request.getReviewedVersionId(),
                    request.getFieldName(),
                    request.getCommentText(),
                    1L // TODO: Get from authentication context
                )
            ));
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het toevoegen van de comment."));
        }
    }
    
    /**
     * Get all comments for a review
     * GET /api/v2/content/reviews/{reviewId}/comments
     */
    @GetMapping("/{reviewId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long reviewId) {
        try {
            List<ReviewCommentDTO> dtos = getReviewCommentsHandler.handle(
                new GetReviewCommentsQuery(reviewId)
            ).stream()
                .map(ReviewCommentDTO::from)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het ophalen van de comments."));
        }
    }
    
    /**
     * Update a review comment
     * PUT /api/v2/content/reviews/comments/{commentId}
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateReviewCommentRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Validation failed", "details", bindingResult.getAllErrors()));
        }
        
        try {
            ReviewCommentDTO dto = ReviewCommentDTO.from(updateReviewCommentHandler.handle(
                new UpdateReviewCommentCommand(
                    commentId,
                    request.getCommentText(),
                    1L // TODO: Get from authentication context
                )
            ));
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het updaten van de comment."));
        }
    }
    
    /**
     * Delete a review comment
     * DELETE /api/v2/content/reviews/comments/{commentId}
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            deleteReviewCommentHandler.handle(
                new DeleteReviewCommentCommand(
                    commentId,
                    1L // TODO: Get from authentication context
                )
            );
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de comment."));
        }
    }
}

