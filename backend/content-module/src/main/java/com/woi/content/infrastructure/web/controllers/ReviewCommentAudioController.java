package com.woi.content.infrastructure.web.controllers;

import com.woi.content.infrastructure.services.ReviewCommentAudioStorage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Controller for voice recording upload and playback.
 */
@RestController
@RequestMapping("/api/v2/content/review-comments")
@CrossOrigin(origins = "*")
public class ReviewCommentAudioController {

    private final ReviewCommentAudioStorage audioStorage;
    private final com.woi.content.application.handlers.commands.AddVoiceReviewCommentCommandHandler addVoiceCommentHandler;

    public ReviewCommentAudioController(
            ReviewCommentAudioStorage audioStorage,
            com.woi.content.application.handlers.commands.AddVoiceReviewCommentCommandHandler addVoiceCommentHandler) {
        this.audioStorage = audioStorage;
        this.addVoiceCommentHandler = addVoiceCommentHandler;
    }

    /**
     * Upload voice recording as comment
     * POST /api/v2/content/review-comments/voice
     */
    @PostMapping("/voice")
    public ResponseEntity<?> uploadVoiceComment(
            @RequestParam Long reviewId,
            @RequestParam Long reviewedVersionId,
            @RequestParam String fieldName,
            @RequestParam("audio") MultipartFile audioFile) {
        if (audioFile.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("error", "Audio file is required"));
        }

        try {
            String filename = audioStorage.save(
                audioFile.getBytes(),
                audioFile.getContentType()
            );

            var result = addVoiceCommentHandler.handle(
                new com.woi.content.application.commands.AddVoiceReviewCommentCommand(
                    reviewId,
                    reviewedVersionId,
                    fieldName,
                    filename,
                    1L // TODO: Get from auth context
                )
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(com.woi.content.infrastructure.web.dtos.ReviewCommentDTO.from(result));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", "Failed to save audio: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    /**
     * Serve audio file for playback
     * GET /api/v2/content/review-comments/audio/{filename}
     */
    @GetMapping("/audio/{filename}")
    public ResponseEntity<byte[]> getAudio(@PathVariable String filename) {
        try {
            byte[] data = audioStorage.load(filename);
            if (data == null) {
                return ResponseEntity.notFound().build();
            }

            String contentType = filename.endsWith(".webm") ? "audio/webm" : "audio/ogg";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(data.length);

            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
