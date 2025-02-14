package Main.service;

import Main.entity.Job;
import Main.entity.User;
import Main.repository.JobRepository;
import Main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
    
    public Job createJob(Job job, String assignedToUserId) {
        if (assignedToUserId != null) {
            User assignedUser = userRepository.findByUserId(assignedToUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            job.setAssignedTo(assignedUser);
        }
        return jobRepository.save(job);
    }
    
    public Job updateJob(Long jobId, Job updatedJob) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
            
        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setStatus(updatedJob.getStatus());
        job.setDeadline(updatedJob.getDeadline());
        
        if (updatedJob.getAssignedTo() != null) {
            job.setAssignedTo(updatedJob.getAssignedTo());
        }
        
        return jobRepository.save(job);
    }
    
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }
} 