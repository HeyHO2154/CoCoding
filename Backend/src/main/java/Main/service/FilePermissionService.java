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
import Main.dto.FilePermissionRequest;

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

    @Transactional
    public void deleteFilePermissionsByJobId(Integer jobId) {
        System.out.println("Deleting permissions for job: " + jobId);  // 로그 추가
        filePermissionRepository.deleteAllByJobId(jobId);
        filePermissionRepository.flush();
    }

    @Transactional
    public void addFilePermissionsBulk(List<FilePermissionRequest> requests) {
        if (!requests.isEmpty()) {
            // 1. 해당 job의 기존 권한 모두 삭제
            Integer jobId = requests.get(0).getJobId();
            filePermissionRepository.deleteAllByJobId(jobId);
            
            // 2. 새로운 권한들 저장
            List<FilePermission> permissions = requests.stream()
                .map(req -> {
                    FilePermission permission = new FilePermission();
                    Job job = new Job();
                    job.setJobId(req.getJobId());
                    permission.setJob(job);
                    permission.setFilePath(req.getFilePath());
                    permission.setCreatedBy(req.getCreatedBy());
                    return permission;
                })
                .collect(Collectors.toList());
            
            filePermissionRepository.saveAll(permissions);
        }
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