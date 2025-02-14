package Main.service;

import Main.entity.Job;
import Main.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;

    
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
    
    public Job createJob(Job job) {
        job.setCreatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
    
    public Job updateJob(Long jobId, Job updatedJob) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
            
        job.setJobName(updatedJob.getJobName());
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