package Main.service;

import Main.entity.Job;
import Main.entity.UserJob;
import Main.repository.JobRepository;
import Main.repository.UserJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserJobRepository userJobRepository;

    
    public List<Job> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        
        // 각 Job에 대한 담당자 정보 설정
        for (Job job : jobs) {
            UserJob userJob = userJobRepository.findTopByIdJobIdOrderByAssignedAtDesc(job.getJobId());
            if (userJob != null) {
                job.setAssignedTo(userJob.getId().getUserId());
            }
        }
        
        return jobs;
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
        
        return jobRepository.save(job);
    }
    
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }
} 