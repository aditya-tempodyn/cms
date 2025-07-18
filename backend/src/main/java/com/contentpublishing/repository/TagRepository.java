package com.contentpublishing.repository;

import com.contentpublishing.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    Boolean existsByName(String name);
    
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Tag> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT t FROM Tag t WHERE " +
           "(:name IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:description IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :description, '%')))")
    Page<Tag> findTagsWithFilters(@Param("name") String name,
                                 @Param("description") String description,
                                 Pageable pageable);
    
    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.articles) DESC")
    List<Tag> findMostUsedTags(Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Tag t JOIN t.articles a WHERE t.id = :tagId")
    Long countArticlesByTagId(@Param("tagId") Long tagId);
} 