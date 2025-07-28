package com.contentpublishing.service;

import com.contentpublishing.entity.Article;
import com.contentpublishing.entity.PublishSchedule;
import com.contentpublishing.entity.User;
import com.contentpublishing.repository.ArticleRepository;
import com.contentpublishing.repository.PublishScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PublishScheduleService {
    
    private static final Logger logger = LoggerFactory.getLogger(PublishScheduleService.class);
    
    @Autowired
    private PublishScheduleRepository scheduleRepository;
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private AuthService authService;
    
    public Page<PublishSchedule> getAllSchedules(Pageable pageable) {
        logger.debug("Fetching all schedules with pagination");
        return scheduleRepository.findAll(pageable);
    }
    
    public Page<PublishSchedule> getSchedulesWithFilters(PublishSchedule.Status status,
                                                       Long articleId, 
                                                       Long createdById,
                                                       LocalDateTime fromDate,
                                                       LocalDateTime toDate,
                                                       Pageable pageable) {
        logger.debug("Fetching schedules with filters: status={}, articleId={}, createdById={}, fromDate={}, toDate={}", 
                    status, articleId, createdById, fromDate, toDate);
        return scheduleRepository.findSchedulesWithFilters(status, articleId, createdById, fromDate, toDate, pageable);
    }
    
    public Optional<PublishSchedule> getScheduleById(Long id) {
        logger.debug("Fetching schedule by ID: {}", id);
        return scheduleRepository.findById(id);
    }
    
    public PublishSchedule createSchedule(PublishSchedule schedule) {
        try {
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Validate article exists
            Article article = articleRepository.findById(schedule.getArticle().getId())
                .orElseThrow(() -> new RuntimeException("Article not found"));
            
            // Check if user is the author or has admin role
            if (!article.getAuthor().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only schedule your own articles");
            }
            
            // Check if article is not already published
            if (article.getStatus() == Article.Status.PUBLISHED) {
                throw new RuntimeException("Cannot schedule: Article is already published");
            }
            
            // Check if there's already a pending schedule for this article
            List<PublishSchedule> existingSchedules = scheduleRepository
                .findByArticleAndStatus(article, PublishSchedule.Status.PENDING);
            if (!existingSchedules.isEmpty()) {
                throw new RuntimeException("Article already has a pending schedule");
            }
            
            schedule.setCreatedBy(currentUser);
            schedule.setArticle(article);
            
            PublishSchedule savedSchedule = scheduleRepository.save(schedule);
            logger.info("Schedule created successfully: {}", savedSchedule.getId());
            return savedSchedule;
            
        } catch (Exception e) {
            logger.error("Failed to create schedule", e);
            throw new RuntimeException("Failed to create schedule: " + e.getMessage(), e);
        }
    }
    
    public PublishSchedule updateSchedule(Long id, PublishSchedule scheduleDetails) {
        try {
            PublishSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the creator or has admin role
            if (!schedule.getCreatedBy().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only edit your own schedules");
            }
            
            // Can only update pending schedules
            if (schedule.getStatus() != PublishSchedule.Status.PENDING) {
                throw new RuntimeException("Can only update pending schedules");
            }
            
            // Validate new scheduled time is in the future
            if (scheduleDetails.getScheduledAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Scheduled time must be in the future");
            }
            
            schedule.setScheduledAt(scheduleDetails.getScheduledAt());
            schedule.setMaxRetries(scheduleDetails.getMaxRetries());
            
            PublishSchedule updatedSchedule = scheduleRepository.save(schedule);
            logger.info("Schedule updated successfully: {}", id);
            return updatedSchedule;
            
        } catch (Exception e) {
            logger.error("Failed to update schedule: {}", id, e);
            throw new RuntimeException("Failed to update schedule: " + e.getMessage(), e);
        }
    }
    
    public void deleteSchedule(Long id) {
        try {
            PublishSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the creator or has admin role
            if (!schedule.getCreatedBy().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only delete your own schedules");
            }
            
            // Can only delete pending or failed schedules
            if (schedule.getStatus() == PublishSchedule.Status.EXECUTED) {
                throw new RuntimeException("Cannot delete executed schedules");
            }
            
            scheduleRepository.delete(schedule);
            logger.info("Schedule deleted successfully: {}", id);
            
        } catch (Exception e) {
            logger.error("Failed to delete schedule: {}", id, e);
            throw new RuntimeException("Failed to delete schedule: " + e.getMessage(), e);
        }
    }
    
    public PublishSchedule cancelSchedule(Long id) {
        try {
            PublishSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the creator or has admin role
            if (!schedule.getCreatedBy().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only cancel your own schedules");
            }
            
            if (schedule.getStatus() != PublishSchedule.Status.PENDING) {
                throw new RuntimeException("Can only cancel pending schedules");
            }
            
            schedule.cancel();
            PublishSchedule cancelledSchedule = scheduleRepository.save(schedule);
            logger.info("Schedule cancelled successfully: {}", id);
            return cancelledSchedule;
            
        } catch (Exception e) {
            logger.error("Failed to cancel schedule: {}", id, e);
            throw new RuntimeException("Failed to cancel schedule: " + e.getMessage(), e);
        }
    }
    
    public PublishSchedule executeSchedule(Long id) {
        try {
            PublishSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
            
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            // Check if user is the creator or has admin role
            if (!schedule.getCreatedBy().getId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("Access denied: You can only execute your own schedules");
            }
            
            if (schedule.getStatus() != PublishSchedule.Status.PENDING) {
                throw new RuntimeException("Can only execute pending schedules");
            }
            
            // Execute the schedule
            executeSchedule(schedule);
            
            logger.info("Schedule executed successfully: {}", id);
            return schedule;
            
        } catch (Exception e) {
            logger.error("Failed to execute schedule: {}", id, e);
            throw new RuntimeException("Failed to execute schedule: " + e.getMessage(), e);
        }
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void executeScheduledPublications() {
        try {
            List<PublishSchedule> readySchedules = scheduleRepository
                .findReadyToExecute(PublishSchedule.Status.PENDING, LocalDateTime.now());
            
            logger.debug("Found {} schedules ready for execution", readySchedules.size());
            
            for (PublishSchedule schedule : readySchedules) {
                try {
                    executeSchedule(schedule);
                } catch (Exception e) {
                    logger.error("Failed to execute schedule: {}", schedule.getId(), e);
                    schedule.markAsFailed(e.getMessage());
                    scheduleRepository.save(schedule);
                }
            }
            
        } catch (Exception e) {
            logger.error("Error in scheduled publication execution", e);
        }
    }
    
    private void executeSchedule(PublishSchedule schedule) {
        try {
            Article article = schedule.getArticle();
            
            // Publish the article
            article.publish();
            articleRepository.save(article);
            
            // Mark schedule as executed
            schedule.markAsExecuted();
            scheduleRepository.save(schedule);
            
            logger.info("Successfully executed schedule {} for article {}", schedule.getId(), article.getId());
            
        } catch (Exception e) {
            logger.error("Failed to execute schedule: {}", schedule.getId(), e);
            throw e;
        }
    }
    
    public Page<PublishSchedule> getSchedulesByUser(User user, Pageable pageable) {
        logger.debug("Fetching schedules by user: {}", user.getUsername());
        return scheduleRepository.findByCreatedBy(user, pageable);
    }
    
    public Page<PublishSchedule> getSchedulesByArticle(Article article, Pageable pageable) {
        logger.debug("Fetching schedules by article: {}", article.getId());
        return scheduleRepository.findByArticle(article, pageable);
    }
    
    public List<PublishSchedule> getFailedSchedulesForRetry() {
        logger.debug("Fetching failed schedules for retry");
        return scheduleRepository.findFailedSchedulesForRetry();
    }
} 