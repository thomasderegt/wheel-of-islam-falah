package com.woi.content.infrastructure.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Stores voice recording audio files for review comments.
 */
@Service
public class ReviewCommentAudioStorage {

    private static final String SUBDIR = "review-comments";

    @Value("${woi.uploads.path:uploads}")
    private String uploadsPath;

    public String save(byte[] audioData, String contentType) throws IOException {
        Path dir = Paths.get(uploadsPath, SUBDIR);
        Files.createDirectories(dir);

        String ext = contentType != null && contentType.contains("webm") ? "webm" : "ogg";
        String filename = UUID.randomUUID().toString() + "." + ext;
        Path file = dir.resolve(filename);
        Files.write(file, audioData);

        return filename;
    }

    public byte[] load(String filename) throws IOException {
        Path file = Paths.get(uploadsPath, SUBDIR, filename);
        if (!Files.exists(file)) {
            return null;
        }
        return Files.readAllBytes(file);
    }

    public boolean exists(String filename) {
        return Files.exists(Paths.get(uploadsPath, SUBDIR, filename));
    }
}
