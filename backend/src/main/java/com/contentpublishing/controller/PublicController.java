package com.contentpublishing.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicController {
    
    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "UP");
            response.put("message", "Content Publishing System is running");
            response.put("timestamp", System.currentTimeMillis());
            response.put("version", "1.0.0");
            
            logger.debug("Health check requested");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Health check failed", e);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "DOWN");
            response.put("message", "Service unavailable");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(503).body(response);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<?> getSystemInfo() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("name", "Content Publishing System");
            response.put("description", "Full-stack content management platform");
            response.put("version", "1.0.0");
            response.put("technology", "Spring Boot + React");
            response.put("database", "MySQL");
            response.put("authentication", "JWT");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to get system info", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "INFO_FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
} 