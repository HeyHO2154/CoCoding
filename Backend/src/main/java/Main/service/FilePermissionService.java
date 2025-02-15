package Main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
            return getAllFiles();  // 모든 파일 접근 가능
        }

        if ("BACKEND_LEAD".equals(userRole)) {
            return getBackendFiles();  // 백엔드 폴더 내 파일들
        }

        if ("FRONTEND_LEAD".equals(userRole)) {
            return getFrontendFiles();  // 프론트엔드 폴더 내 파일들
        }

        // 일반 개발자의 경우 배정된 업무의 파일들만 접근 가능
        List<UserJob> userJobs = userJobRepository.findByIdUserId(userId);
        List<Integer> jobIds = userJobs.stream()
            .map(uj -> uj.getId().getJobId())
            .collect(Collectors.toList());

        return filePermissionRepository.findByJobJobIdIn(jobIds).stream()
            .map(FilePermission::getFilePath)
            .collect(Collectors.toList());
    }

    public void addFilePermission(Integer jobId, String filePath, String createdBy) {
        FilePermission permission = new FilePermission();
        Job job = new Job();
        job.setJobId(jobId);  // Job 객체 직접 설정
        permission.setJob(job);
        permission.setFilePath(filePath);
        permission.setCreatedAt(LocalDateTime.now());
        permission.setCreatedBy(createdBy);
        filePermissionRepository.save(permission);
    }

    private List<String> getAllFiles() {
        // 모든 파일 경로 반환
        return null; // 구현 필요
    }

    private List<String> getBackendFiles() {
        // Backend 폴더 내 파일들만 반환
        return null; // 구현 필요
    }

    private List<String> getFrontendFiles() {
        // Frontend 폴더 내 파일들만 반환
        return null; // 구현 필요
    }
} 