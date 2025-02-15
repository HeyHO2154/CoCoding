package Main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

import Main.service.FilePermissionService;
import Main.entity.FilePermission;
import Main.dto.FilePermissionRequest;

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

    @PostMapping("/bulk")
    public ResponseEntity<?> addFilePermissionsBulk(@RequestBody List<FilePermissionRequest> requests) {
        try {
            filePermissionService.addFilePermissionsBulk(requests);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<FilePermission>> getFilePermissionsByJobId(@PathVariable Integer jobId) {
        return ResponseEntity.ok(filePermissionService.getFilePermissionsByJobId(jobId));
    }

    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<?> deleteByJobId(@PathVariable Integer jobId) {
        try {
            filePermissionService.deleteFilePermissionsByJobId(jobId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 