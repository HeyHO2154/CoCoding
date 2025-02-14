package Main.controller;

import Main.entity.Job;
import Main.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    
    @Autowired
    private JobService jobService;
    
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    
    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        try {
            Job createdJob = jobService.createJob(job);
            return ResponseEntity.ok(createdJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId, @RequestBody Job job) {
        try {
            Job updatedJob = jobService.updateJob(jobId, job);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        try {
            jobService.deleteJob(jobId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 