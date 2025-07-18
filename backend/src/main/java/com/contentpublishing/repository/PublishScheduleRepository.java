package com.contentpublishing.repository;

import com.contentpublishing.entity.Article;
import com.contentpublishing.entity.PublishSchedule;
import com.contentpublishing.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PublishScheduleRepository extends JpaRepository<PublishSchedule, Long> {
    
    Page<PublishSchedule> findByCreatedBy(User createdBy, Pageable pageable);
    
    Page<PublishSchedule> findByArticle(Article article, Pageable pageable);
    
    Page<PublishSchedule> findByStatus(PublishSchedule.Status status, Pageable pageable);
    
    @Query("SELECT ps FROM PublishSchedule ps WHERE ps.status = :status AND ps.scheduledAt <= :now")
    List<PublishSchedule> findReadyToExecute(@Param("status") PublishSchedule.Status status, 
                                           @Param("now") LocalDateTime now);
    
    @Query("SELECT ps FROM PublishSchedule ps WHERE " +
           "(:status IS NULL OR ps.status = :status) AND " +
           "(:articleId IS NULL OR ps.article.id = :articleId) AND " +
           "(:createdById IS NULL OR ps.createdBy.id = :createdById) AND " +
           "(:fromDate IS NULL OR ps.scheduledAt >= :fromDate) AND " +
           "(:toDate IS NULL OR ps.scheduledAt <= :toDate)")
    Page<PublishSchedule> findSchedulesWithFilters(@Param("status") PublishSchedule.Status status,
                                                  @Param("articleId") Long articleId,
                                                  @Param("createdById") Long createdById,
                                                  @Param("fromDate") LocalDateTime fromDate,
                                                  @Param("toDate") LocalDateTime toDate,
                                                  Pageable pageable);
    
    @Query("SELECT ps FROM PublishSchedule ps WHERE ps.status = 'FAILED' AND ps.retryCount < ps.maxRetries")
    List<PublishSchedule> findFailedSchedulesForRetry();
    
    List<PublishSchedule> findByArticleAndStatus(Article article, PublishSchedule.Status status);
} 