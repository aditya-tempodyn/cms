package com.contentpublishing.repository;

import com.contentpublishing.entity.Article;
import com.contentpublishing.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    Optional<Article> findBySlug(String slug);
    
    Page<Article> findByAuthor(User author, Pageable pageable);
    
    Page<Article> findByStatus(Article.Status status, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = :status AND a.publishedAt <= :now")
    Page<Article> findPublishedArticles(@Param("status") Article.Status status, 
                                       @Param("now") LocalDateTime now, 
                                       Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE " +
           "(:title IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:content IS NULL OR LOWER(a.content) LIKE LOWER(CONCAT('%', :content, '%'))) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:authorId IS NULL OR a.author.id = :authorId)")
    Page<Article> findArticlesWithFilters(@Param("title") String title,
                                         @Param("content") String content,
                                         @Param("status") Article.Status status,
                                         @Param("authorId") Long authorId,
                                         Pageable pageable);
    
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.id = :tagId")
    Page<Article> findByTagId(@Param("tagId") Long tagId, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(a.summary) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Article> searchArticles(@Param("keyword") String keyword, Pageable pageable);
    
    List<Article> findTop5ByOrderByViewCountDesc();
    
    List<Article> findTop10ByStatusOrderByCreatedAtDesc(Article.Status status);
} 