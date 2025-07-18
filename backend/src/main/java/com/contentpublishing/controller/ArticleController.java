package com.contentpublishing.controller;

import com.contentpublishing.entity.Article;
import com.contentpublishing.service.ArticleService;
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
@RequestMapping("/articles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ArticleController {
    
    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);
    
    @Autowired
    private ArticleService articleService;
    
    @GetMapping
    public ResponseEntity<?> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) Article.Status status,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) String search) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Article> articles;
            
            if (search != null && !search.trim().isEmpty()) {
                articles = articleService.searchArticles(search, pageable);
            } else if (title != null || content != null || status != null || authorId != null) {
                articles = articleService.getArticlesWithFilters(title, content, status, authorId, pageable);
            } else {
                articles = articleService.getAllArticles(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", articles);
            response.put("message", "Articles retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch articles", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        try {
            Optional<Article> article = articleService.getArticleById(id);
            
            if (article.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", article.get());
                response.put("message", "Article retrieved successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Article not found");
                response.put("error", "NOT_FOUND");
                
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Failed to fetch article: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> createArticle(@Valid @RequestBody Article article) {
        try {
            Article createdArticle = articleService.createArticle(article);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdArticle);
            response.put("message", "Article created successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to create article", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "CREATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @Valid @RequestBody Article articleDetails) {
        try {
            Article updatedArticle = articleService.updateArticle(id, articleDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updatedArticle);
            response.put("message", "Article updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to update article: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "UPDATE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Article deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to delete article: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "DELETE_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<?> publishArticle(@PathVariable Long id) {
        try {
            Article publishedArticle = articleService.publishArticle(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", publishedArticle);
            response.put("message", "Article published successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to publish article: {}", id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "PUBLISH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/published")
    public ResponseEntity<?> getPublishedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
            Page<Article> articles = articleService.getPublishedArticles(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", articles);
            response.put("message", "Published articles retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch published articles", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/most-viewed")
    public ResponseEntity<?> getMostViewedArticles() {
        try {
            List<Article> articles = articleService.getMostViewedArticles();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", articles);
            response.put("message", "Most viewed articles retrieved successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch most viewed articles", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", "FETCH_FAILED");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
} 