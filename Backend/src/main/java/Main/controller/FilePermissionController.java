package Main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

import Main.service.FilePermissionService;
import Main.entity.FilePermission;

@RestController
@RequestMapping("/api/file-permissions")
@CrossOrigin(origins = "http://localhost:5173")
public class FilePermissionController {
    @Autowired
    private FilePermissionService filePermissionService;

    @GetMapping("/accessible")
    public ResponseEntity<List<String>> getAccessibleFiles(
            @RequestParam String userId,
            @RequestParam String userRole) {
        try {
            List<String> accessibleFiles = filePermissionService.getAccessibleFiles(userId, userRole);
            return ResponseEntity.ok(accessibleFiles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // 빈 리스트라도 반환
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addFilePermission(@RequestBody FilePermissionRequest request) {
        filePermissionService.addFilePermission(
            request.getJobId(),
            request.getFilePath(),
            request.getCreatedBy()
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<FilePermission>> getFilePermissionsByJobId(@PathVariable Integer jobId) {
        return ResponseEntity.ok(filePermissionService.getFilePermissionsByJobId(jobId));
    }

    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<?> deleteFilePermissionsByJobId(@PathVariable Integer jobId) {
        filePermissionService.deleteFilePermissionsByJobId(jobId);
        return ResponseEntity.ok().build();
    }
}

class FilePermissionRequest {
    private Integer jobId;
    private String filePath;
    private String createdBy;

    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
} 