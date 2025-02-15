package Main.controller;

import Main.service.UserJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Main.entity.UserJob;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserJobController {
    
    @Autowired
    private UserJobService userJobService;
    
    @PostMapping("/jobs/{jobId}/assign")
    public ResponseEntity<?> assignJob(
        @PathVariable Integer jobId,
        @RequestBody Map<String, String> request
    ) {
        try {
            String userId = request.get("userId");
            String assignedBy = request.get("assignedBy");
            
            UserJob userJob = userJobService.assignJob(userId, jobId, assignedBy);
            return ResponseEntity.ok(userJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 