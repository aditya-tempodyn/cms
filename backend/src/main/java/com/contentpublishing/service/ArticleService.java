package com.contentpublishing.service;

import com.contentpublishing.entity.Article;
import com.contentpublishing.entity.Tag;
import com.contentpublishing.entity.User;
import com.contentpublishing.repository.ArticleRepository;
import com.contentpublishing.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
@Transactional
public class ArticleService {
    
    private static final Logger logger = LoggerFactory.getLogger(ArticleService.class);
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private AuthService authService;
    
    public Page<Article> getAllArticles(Pageable pageable) {
        logger.debug("Fetching all articles with pagination");
        return articleRepository.findAll(pageable);
    }
    
    public Page<Article> getArticlesWithFilters(String title, String content, 
                                              Article.Status status, Long authorId, 
                                              Pageable pageable) {
        logger.debug("Fetching articles with filters: title={}, content={}, status={}, authorId={}", 
                    title, content, status, authorId);
        return articleRepository.findArticlesWithFilters(title, content, status, authorId, pageable);
    }
    
    public Page<Article> searchArticles(String keyword, Pageable pageable) {
        logger.debug("Searching articles with keyword: {}", keyword);
        return articleRepository.searchArticles(keyword, pageable);
    }
    
    public Optional<Article> getArticleById(Long id) {
        logger.debug("Fetching article by ID: {}", id);
        Optional<Article> article = articleRepository.findById(id);
        
        // Increment view count if article is found and published
        if (article.isPresent() && article.get().getStatus() == Article.Status.PUBLISHED) {
            article.get().incrementViewCount();
            articleRepository.save(article.get());
        }
        
        return article;
    }
    
    public Optional<Article> getArticleBySlug(String slug) {
        logger.debug("Fetching article by slug: {}", slug);
        Optional<Article> article = articleRepository.findBySlug(slug);
        
        // Increment view count if article is found and published
        if (article.isPresent() && article.get().getStatus() == Article.Status.PUBLISHED) {
            article.get().incrementViewCount();
            articleRepository.save(article.get());
        }
        
        return article;
    }
    
    public Article createArticle(Article article) {
        try {
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            article.setAuthor(currentUser);
            
            // Process tags
            if (article.getTags() != null && !article.getTags().isEmpty()) {
                List<Tag> processedTags = article.getTags().stream()
                    .map(tag -> {
                        if (tag.getId() != null) {
                            return tagRepository.findById(tag.getId())
                                .orElseThrow(() -> new RuntimeException("Tag not found: " + tag.getId()));
                        } else {
                            // Check if tag with same name exists
                            Optional<Tag> existingTag = tagRepository.findByName(tag.getName());
                            return existingTag.orElseGet(() -> tagRepository.save(tag));
                        }
                    })
                    .toList();
                article.setTags(processedTags);
            }
            
            Article savedArticle = articleRepository.save(article);
            logger.info("Article created successfully: {}", savedArticle.getId());
            return savedArticle;
            
        } catch (Exception e) {
            logger.error("Failed to create article", e);
            throw new RuntimeException("Failed to create article: " + e.getMessage(), e);
        }
    }
    
    public Article updateArticle(Long id, Article articleDetails) {
        try {
            Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the author or has admin role
            if (!article.getAuthor().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only edit your own articles");
            }
            
            // Update fields
            article.setTitle(articleDetails.getTitle());
            article.setContent(articleDetails.getContent());
            article.setSummary(articleDetails.getSummary());
            article.setFeaturedImageUrl(articleDetails.getFeaturedImageUrl());
            article.setMetaTitle(articleDetails.getMetaTitle());
            article.setMetaDescription(articleDetails.getMetaDescription());
            
            // Process tags
            if (articleDetails.getTags() != null) {
                List<Tag> processedTags = articleDetails.getTags().stream()
                    .map(tag -> {
                        if (tag.getId() != null) {
                            return tagRepository.findById(tag.getId())
                                .orElseThrow(() -> new RuntimeException("Tag not found: " + tag.getId()));
                        } else {
                            Optional<Tag> existingTag = tagRepository.findByName(tag.getName());
                            return existingTag.orElseGet(() -> tagRepository.save(tag));
                        }
                    })
                    .toList();
                article.setTags(new ArrayList<>(processedTags));
            }
            
            Article updatedArticle = articleRepository.save(article);
            logger.info("Article updated successfully: {}", id);
            return updatedArticle;
            
        } catch (Exception e) {
            logger.error("Failed to update article: {}", id, e);
            throw new RuntimeException("Failed to update article: " + e.getMessage(), e);
        }
    }
    
    public Article publishArticle(Long id) {
        try {
            Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the author or has admin role
            if (!article.getAuthor().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only publish your own articles");
            }
            
            article.publish();
            Article publishedArticle = articleRepository.save(article);
            logger.info("Article published successfully: {}", id);
            return publishedArticle;
            
        } catch (Exception e) {
            logger.error("Failed to publish article: {}", id, e);
            throw new RuntimeException("Failed to publish article: " + e.getMessage(), e);
        }
    }
    
    public void deleteArticle(Long id) {
        try {
            Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the author or has admin role
            if (!article.getAuthor().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only delete your own articles");
            }
            
            articleRepository.delete(article);
            logger.info("Article deleted successfully: {}", id);
            
        } catch (Exception e) {
            logger.error("Failed to delete article: {}", id, e);
            throw new RuntimeException("Failed to delete article: " + e.getMessage(), e);
        }
    }
    
    public Page<Article> getPublishedArticles(Pageable pageable) {
        logger.debug("Fetching published articles");
        return articleRepository.findPublishedArticles(Article.Status.PUBLISHED, LocalDateTime.now(), pageable);
    }
    
    public Page<Article> getArticlesByAuthor(User author, Pageable pageable) {
        logger.debug("Fetching articles by author: {}", author.getUsername());
        return articleRepository.findByAuthor(author, pageable);
    }
    
    public Page<Article> getArticlesByTag(Long tagId, Pageable pageable) {
        logger.debug("Fetching articles by tag ID: {}", tagId);
        return articleRepository.findByTagId(tagId, pageable);
    }
    
    public List<Article> getMostViewedArticles() {
        logger.debug("Fetching most viewed articles");
        return articleRepository.findTop5ByOrderByViewCountDesc();
    }
    
    public List<Article> getRecentArticles() {
        logger.debug("Fetching recent published articles");
        return articleRepository.findTop10ByStatusOrderByCreatedAtDesc(Article.Status.PUBLISHED);
    }
} 