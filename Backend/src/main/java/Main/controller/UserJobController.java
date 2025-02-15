package Main.controller;

import Main.service.UserJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Main.entity.UserJob;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserJobController {
    
    @Autowired
    private UserJobService userJobService;
    
    @PostMapping("/user-jobs")
    public ResponseEntity<?> assignJob(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Integer jobId = (Integer) request.get("jobId");
            String assignedBy = (String) request.get("assignedBy");
            
            UserJob userJob = userJobService.assignJob(userId, jobId, assignedBy);
            return ResponseEntity.ok(userJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/user-jobs/job/{jobId}")
    public ResponseEntity<?> deleteByJobId(@PathVariable Integer jobId) {
        userJobService.deleteByJobId(jobId);
        return ResponseEntity.ok().build();
    }
} 