package com.contentpublishing.service;

import com.contentpublishing.entity.Tag;
import com.contentpublishing.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TagService {
    
    private static final Logger logger = LoggerFactory.getLogger(TagService.class);
    
    @Autowired
    private TagRepository tagRepository;
    
    public Page<Tag> getAllTags(Pageable pageable) {
        logger.debug("Fetching all tags with pagination");
        return tagRepository.findAll(pageable);
    }
    
    public Page<Tag> getTagsWithFilters(String name, String description, Pageable pageable) {
        logger.debug("Fetching tags with filters: name={}, description={}", name, description);
        return tagRepository.findTagsWithFilters(name, description, pageable);
    }
    
    public Page<Tag> searchTagsByName(String name, Pageable pageable) {
        logger.debug("Searching tags by name: {}", name);
        return tagRepository.findByNameContainingIgnoreCase(name, pageable);
    }
    
    public Optional<Tag> getTagById(Long id) {
        logger.debug("Fetching tag by ID: {}", id);
        return tagRepository.findById(id);
    }
    
    public Optional<Tag> getTagByName(String name) {
        logger.debug("Fetching tag by name: {}", name);
        return tagRepository.findByName(name);
    }
    
    public Tag createTag(Tag tag) {
        try {
            // Check if tag with same name already exists
            if (tagRepository.existsByName(tag.getName())) {
                throw new RuntimeException("Tag with name '" + tag.getName() + "' already exists");
            }
            
            Tag savedTag = tagRepository.save(tag);
            logger.info("Tag created successfully: {}", savedTag.getId());
            return savedTag;
            
        } catch (Exception e) {
            logger.error("Failed to create tag", e);
            throw new RuntimeException("Failed to create tag: " + e.getMessage(), e);
        }
    }
    
    public Tag updateTag(Long id, Tag tagDetails) {
        try {
            Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
            
            // Check if another tag with the same name exists (excluding current tag)
            Optional<Tag> existingTag = tagRepository.findByName(tagDetails.getName());
            if (existingTag.isPresent() && !existingTag.get().getId().equals(id)) {
                throw new RuntimeException("Tag with name '" + tagDetails.getName() + "' already exists");
            }
            
            tag.setName(tagDetails.getName());
            tag.setDescription(tagDetails.getDescription());
            tag.setColorCode(tagDetails.getColorCode());
            
            Tag updatedTag = tagRepository.save(tag);
            logger.info("Tag updated successfully: {}", id);
            return updatedTag;
            
        } catch (Exception e) {
            logger.error("Failed to update tag: {}", id, e);
            throw new RuntimeException("Failed to update tag: " + e.getMessage(), e);
        }
    }
    
    public void deleteTag(Long id) {
        try {
            Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
            
            // Check if tag is being used by articles
            Long articleCount = tagRepository.countArticlesByTagId(id);
            if (articleCount > 0) {
                throw new RuntimeException("Cannot delete tag: It is being used by " + articleCount + " article(s)");
            }
            
            tagRepository.delete(tag);
            logger.info("Tag deleted successfully: {}", id);
            
        } catch (Exception e) {
            logger.error("Failed to delete tag: {}", id, e);
            throw new RuntimeException("Failed to delete tag: " + e.getMessage(), e);
        }
    }
    
    public List<Tag> getMostUsedTags(int limit) {
        logger.debug("Fetching most used tags with limit: {}", limit);
        return tagRepository.findMostUsedTags(PageRequest.of(0, limit));
    }
    
    public Long getArticleCountByTag(Long tagId) {
        logger.debug("Getting article count for tag: {}", tagId);
        return tagRepository.countArticlesByTagId(tagId);
    }
    
    public boolean existsByName(String name) {
        return tagRepository.existsByName(name);
    }
} 