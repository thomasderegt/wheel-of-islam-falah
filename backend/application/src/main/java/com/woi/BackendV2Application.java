package com.woi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
    "com.woi",
    "com.woi.user",
    "com.woi.content",
    "com.woi.learning",
    "com.woi.assessment",
    "com.woi.goalsokr"
})
public class BackendV2Application {
    public static void main(String[] args) {
        SpringApplication.run(BackendV2Application.class, args);
    }
}

