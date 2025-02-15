package Main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import Main.entity.FilePermission;

@Repository
public interface FilePermissionRepository extends JpaRepository<FilePermission, Integer> {
    List<FilePermission> findByJobJobId(Integer jobId);
    List<FilePermission> findByJobJobIdIn(List<Integer> jobIds);
    boolean existsByJobJobIdAndFilePath(Integer jobId, String filePath);
} 