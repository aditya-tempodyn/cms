package com.contentpublishing.controller;

import com.contentpublishing.entity.Tag;
import com.contentpublishing.service.TagService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TagController {
    
    private static final Logger logger = LoggerFactory.getLogger(TagController.class);
    
    @Autowired
    private TagService tagService;
    
    @GetMapping
    public ResponseEntity<?> getAllTags(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String search) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Tag> tags;
            
            if (search != null && !search.trim().isEmpty()) {
                tags = tagService.searchTagsByName(search, pageable);
            } else if (name != null || description != null) {
                tags = tagService.getTagsWithFilters(name, description, pageable);
            } else {
                tags = tagService.getAllTags(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tags);
            response.put("message", "Tags retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch tags", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTagById(@PathVariable Long id) {
        try {
            Optional<Tag> tag = tagService.getTagById(id);
            
            if (tag.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", tag.get());
                response.put("message", "Tag retrieved successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Tag not found");
                response.put("error", "NOT_FOUND");
                
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Failed to fetch tag: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> createTag(@Valid @RequestBody Tag tag) {
        try {
            Tag createdTag = tagService.createTag(tag);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdTag);
            response.put("message", "Tag created successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to create tag", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "CREATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> updateTag(@PathVariable Long id, @Valid @RequestBody Tag tagDetails) {
        try {
            Tag updatedTag = tagService.updateTag(id, tagDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updatedTag);
            response.put("message", "Tag updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to update tag: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "UPDATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tag deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to delete tag: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "DELETE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<?> getMostUsedTags(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Tag> tags = tagService.getMostUsedTags(limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tags);
            response.put("message", "Popular tags retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch popular tags", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
} 