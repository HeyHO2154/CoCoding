package Main.service;

import Main.entity.Job;
import Main.entity.UserJob;
import Main.repository.JobRepository;
import Main.repository.UserJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Main.dto.FilePermissionDTO;
import Main.entity.FilePermission;
import Main.repository.FilePermissionRepository;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserJobRepository userJobRepository;
    
    @Autowired
    private FilePermissionRepository filePermissionRepository;

    
    public List<Job> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        
        for (Job job : jobs) {
            UserJob userJob = userJobRepository.findTopByIdJobIdOrderByAssignedAtDesc(job.getJobId());
            if (userJob != null) {
                job.setAssignedTo(userJob.getId().getUserId());
                job.setAssignedBy(userJob.getAssignedBy());
                job.setAssignedAt(userJob.getAssignedAt());
            }
        }
        
        return jobs;
    }
    
    public Job createJob(Job job) {
        job.setCreatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
    
    @Transactional
    public void updateJob(Integer jobId, Job job, List<FilePermissionDTO> permissions) {
        // 1. 작업 정보 업데이트
        jobRepository.save(job);
        
        // 2. 기존 파일 권한 모두 삭제
        filePermissionRepository.deleteAllByJobId(jobId);
        
        // 3. 새로운 파일 권한 저장
        permissions.forEach(p -> {
            FilePermission permission = new FilePermission();
            permission.setJob(job);
            permission.setFilePath(p.getFilePath());
            permission.setCreatedBy(p.getCreatedBy());
            filePermissionRepository.save(permission);
        });
    }
    
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }
} 