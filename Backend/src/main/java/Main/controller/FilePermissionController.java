package Main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import Main.service.FilePermissionService;

@RestController
@RequestMapping("/api/file-permissions")
public class FilePermissionController {
    @Autowired
    private FilePermissionService filePermissionService;

    @GetMapping("/accessible")
    public ResponseEntity<List<String>> getAccessibleFiles(
            @RequestParam String userId,
            @RequestParam String userRole) {
        return ResponseEntity.ok(filePermissionService.getAccessibleFiles(userId, userRole));
    }

    @PostMapping
    public ResponseEntity<Void> addFilePermission(
            @RequestParam Integer jobId,
            @RequestParam String filePath,
            @RequestParam String createdBy) {
        filePermissionService.addFilePermission(jobId, filePath, createdBy);
        return ResponseEntity.ok().build();
    }
} 