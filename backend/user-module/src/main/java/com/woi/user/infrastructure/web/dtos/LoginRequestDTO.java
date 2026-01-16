package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for user login request
 */
public class LoginRequestDTO {
    
    @NotBlank(message = "Email is verplicht")
    @Email(message = "Ongeldig email adres")
    private String email;
    
    @NotBlank(message = "Wachtwoord is verplicht")
    private String password;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

