package com.woi.user.infrastructure.services;

import com.woi.user.application.ports.output.JwtTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * JWT Token Service implementation
 * Implements JwtTokenService interface from application layer
 */
@Service
public class JwtTokenServiceImpl implements JwtTokenService {
    
    private final SecretKey secretKey;
    private final long expirationMillis;
    
    public JwtTokenServiceImpl(
            @Value("${jwt.secret:default-secret-key-change-in-production-min-256-bits}") String secret,
            @Value("${jwt.expiration:900000}") long expirationMillis) { // Default 15 minutes
        // Generate secret key from string (minimum 256 bits for HS256)
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }
    
    @Override
    public String generateToken(Long userId, String email) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(expirationMillis);
        
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(secretKey)
            .compact();
    }
    
    @Override
    public Long validateToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        return Long.parseLong(claims.getSubject());
    }
    
    @Override
    public LocalDateTime getExpirationTime(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        Date expiration = claims.getExpiration();
        return LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault());
    }
}

