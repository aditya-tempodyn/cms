package com.contentpublishing;

import com.contentpublishing.entity.Article;
import com.contentpublishing.entity.Tag;
import com.contentpublishing.entity.User;
import com.contentpublishing.repository.ArticleRepository;
import com.contentpublishing.repository.TagRepository;
import com.contentpublishing.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");
        
        // Create test user if not exists
        User testUser = createTestUser();
        
        // Create test tags if not exist
        List<Tag> tags = createTestTags();
        
        // Create test articles if not exist
        createTestArticles(testUser, tags);
        
        logger.info("Data initialization completed!");
    }
    
    private User createTestUser() {
        return userRepository.findByUsername("testuser")
            .orElseGet(() -> {
                User user = new User();
                user.setUsername("testuser");
                user.setEmail("test@example.com");
                user.setPassword(passwordEncoder.encode("password123"));
                user.setFirstName("Test");
                user.setLastName("User");
                user.setRole(User.Role.USER);
                user.setIsEnabled(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                
                User savedUser = userRepository.save(user);
                logger.info("Created test user: {}", savedUser.getUsername());
                return savedUser;
            });
    }
    
    private List<Tag> createTestTags() {
        List<String> tagNames = Arrays.asList("Technology", "Programming", "Web Development", "JavaScript", "React");
        List<Tag> tags = tagNames.stream()
            .map(name -> tagRepository.findByName(name)
                .orElseGet(() -> {
                    Tag tag = new Tag();
                    tag.setName(name);
                    tag.setDescription("Tag for " + name);
                    tag.setColorCode("#667eea");
                    tag.setCreatedAt(LocalDateTime.now());
                    tag.setUpdatedAt(LocalDateTime.now());
                    return tagRepository.save(tag);
                }))
            .toList();
        
        logger.info("Created/verified {} tags", tags.size());
        return tags;
    }
    
    private void createTestArticles(User author, List<Tag> tags) {
        if (articleRepository.count() > 0) {
            logger.info("Articles already exist, skipping creation");
            return;
        }
        
        List<Article> articles = Arrays.asList(
            createArticle("Getting Started with React", 
                "React is a powerful JavaScript library for building user interfaces. In this article, we'll explore the basics of React and how to get started with your first component.",
                "Learn the fundamentals of React and build your first component with this comprehensive guide.",
                author, Arrays.asList(tags.get(0), tags.get(1), tags.get(2))),
            
            createArticle("Modern JavaScript Features", 
                "JavaScript has evolved significantly over the years. Let's explore some of the most useful modern features including arrow functions, destructuring, and async/await.",
                "Discover the latest JavaScript features that will make your code more readable and efficient.",
                author, Arrays.asList(tags.get(1), tags.get(3))),
            
            createArticle("Building Responsive Web Applications", 
                "Responsive design is crucial in today's mobile-first world. Learn how to create web applications that work seamlessly across all devices.",
                "Master the art of responsive web design with practical examples and best practices.",
                author, Arrays.asList(tags.get(2), tags.get(0))),
            
            createArticle("Introduction to Web Development", 
                "Web development is an exciting field that combines creativity with technical skills. This article covers the basics of HTML, CSS, and JavaScript.",
                "Start your journey in web development with this comprehensive introduction to the core technologies.",
                author, Arrays.asList(tags.get(2), tags.get(1))),
            
            createArticle("Advanced React Patterns", 
                "Once you've mastered the basics of React, it's time to explore advanced patterns and techniques that will make your applications more maintainable and performant.",
                "Take your React skills to the next level with these advanced patterns and best practices.",
                author, Arrays.asList(tags.get(4), tags.get(0), tags.get(1)))
        );
        
        for (Article article : articles) {
            articleRepository.save(article);
        }
        
        logger.info("Created {} test articles", articles.size());
    }
    
    private Article createArticle(String title, String content, String summary, User author, List<Tag> articleTags) {
        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setSummary(summary);
        article.setAuthor(author);
        article.setStatus(Article.Status.PUBLISHED);
        article.setPublishedAt(LocalDateTime.now());
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());
        article.setViewCount(0L);
        article.setSlug(title.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-"));
        article.setTags(articleTags);
        
        return article;
    }
} 