package Main.service;

import Main.entity.UserJob;
import Main.entity.UserJobId;
import Main.repository.UserJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;

@Service
public class UserJobService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserJobService.class);
    
    @Autowired
    private UserJobRepository userJobRepository;
    
    @Transactional
    public UserJob assignJob(String userId, Integer jobId, String assignedBy) {
        try {
            logger.info("Assigning job: jobId={}, userId={}, assignedBy={}", jobId, userId, assignedBy);
            
            UserJob userJob = new UserJob();
            UserJobId id = new UserJobId();
            id.setUserId(userId);
            id.setJobId(jobId);
            
            userJob.setId(id);
            userJob.setAssignedAt(LocalDateTime.now());
            userJob.setAssignedBy(assignedBy);
            
            UserJob savedJob = userJobRepository.save(userJob);
            logger.info("Job assigned successfully: {}", savedJob);
            return savedJob;
        } catch (Exception e) {
            logger.error("Error assigning job: {}", e.getMessage(), e);
            throw e;
        }
    }
} 