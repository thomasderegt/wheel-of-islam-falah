package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for refresh token request
 */
public class RefreshTokenRequestDTO {
    
    @NotBlank(message = "Refresh token is verplicht")
    private String refreshToken;
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

