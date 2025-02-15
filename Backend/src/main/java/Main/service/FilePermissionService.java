package Main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import Main.entity.FilePermission;
import Main.repository.FilePermissionRepository;
import Main.repository.UserJobRepository;

import Main.entity.Job;
import Main.entity.UserJob;

@Service
@Transactional
public class FilePermissionService {
    @Autowired
    private FilePermissionRepository filePermissionRepository;
    
    @Autowired
    private UserJobRepository userJobRepository;

    public List<String> getAccessibleFiles(String userId, String userRole) {
        if ("PROJECT_LEAD".equals(userRole)) {
            return getAllFiles();
        }

        if ("FRONTEND_LEAD".equals(userRole)) {
            return getFrontendFiles();
        }

        if ("BACKEND_LEAD".equals(userRole)) {
            return getBackendFiles();
        }

        // 일반 개발자의 경우 배정된 업무의 파일들만 접근 가능
        List<UserJob> userJobs = userJobRepository.findByIdUserId(userId);
        System.out.println("Found UserJobs for user " + userId + ": " + userJobs.size());
        
        List<Integer> jobIds = userJobs.stream()
            .map(uj -> uj.getId().getJobId())
            .collect(Collectors.toList());
        System.out.println("Job IDs: " + jobIds);
        
        List<FilePermission> permissions = filePermissionRepository.findByJobJobIdIn(jobIds);
        System.out.println("Found FilePermissions: " + permissions.size());
        
        List<String> filePaths = permissions.stream()
            .map(FilePermission::getFilePath)
            .map(path -> {
                // DB에 저장된 경로가 이미 상대 경로이므로 변환 불필요
                System.out.println("Processing path: " + path); // 디버깅용
                return path;
            })
            .collect(Collectors.toList());
        System.out.println("Accessible file paths: " + filePaths);
        
        return filePaths;
    }

    public void addFilePermission(Integer jobId, String filePath, String createdBy) {
        FilePermission permission = new FilePermission();
        Job job = new Job();
        job.setJobId(jobId);
        permission.setJob(job);
        permission.setFilePath(filePath);
        permission.setCreatedBy(createdBy);
        filePermissionRepository.save(permission);
    }

    public List<FilePermission> getFilePermissionsByJobId(Integer jobId) {
        return filePermissionRepository.findByJobJobId(jobId);
    }

    public void deleteFilePermissionsByJobId(Integer jobId) {
        List<FilePermission> permissions = filePermissionRepository.findByJobJobId(jobId);
        filePermissionRepository.deleteAll(permissions);
    }

    private List<String> getAllFiles() {
        return filePermissionRepository.findAll().stream()
            .map(FilePermission::getFilePath)
            .collect(Collectors.toList());
    }

    private List<String> getBackendFiles() {
        return getAllFiles().stream()
            .filter(path -> path.startsWith("Backend/"))
            .collect(Collectors.toList());
    }

    private List<String> getFrontendFiles() {
        return getAllFiles().stream()
            .filter(path -> path.startsWith("Frontend/"))
            .collect(Collectors.toList());
    }
} 