package com.contentpublishing.controller;

import com.contentpublishing.entity.PublishSchedule;
import com.contentpublishing.service.PublishScheduleService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/schedules")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublishScheduleController {
    
    private static final Logger logger = LoggerFactory.getLogger(PublishScheduleController.class);
    
    @Autowired
    private PublishScheduleService scheduleService;
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> getAllSchedules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "scheduledAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) PublishSchedule.Status status,
            @RequestParam(required = false) Long articleId,
            @RequestParam(required = false) Long createdById,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<PublishSchedule> schedules;
            
            if (status != null || articleId != null || createdById != null || fromDate != null || toDate != null) {
                schedules = scheduleService.getSchedulesWithFilters(status, articleId, createdById, fromDate, toDate, pageable);
            } else {
                schedules = scheduleService.getAllSchedules(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", schedules);
            response.put("message", "Schedules retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch schedules", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        try {
            Optional<PublishSchedule> schedule = scheduleService.getScheduleById(id);
            
            if (schedule.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", schedule.get());
                response.put("message", "Schedule retrieved successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Schedule not found");
                response.put("error", "NOT_FOUND");
                
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Failed to fetch schedule: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> createSchedule(@Valid @RequestBody PublishSchedule schedule) {
        try {
            PublishSchedule createdSchedule = scheduleService.createSchedule(schedule);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdSchedule);
            response.put("message", "Schedule created successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to create schedule", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "CREATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @Valid @RequestBody PublishSchedule scheduleDetails) {
        try {
            PublishSchedule updatedSchedule = scheduleService.updateSchedule(id, scheduleDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updatedSchedule);
            response.put("message", "Schedule updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to update schedule: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "UPDATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            scheduleService.deleteSchedule(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Schedule deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to delete schedule: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "DELETE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> cancelSchedule(@PathVariable Long id) {
        try {
            PublishSchedule cancelledSchedule = scheduleService.cancelSchedule(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cancelledSchedule);
            response.put("message", "Schedule cancelled successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to cancel schedule: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "CANCEL_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
} 