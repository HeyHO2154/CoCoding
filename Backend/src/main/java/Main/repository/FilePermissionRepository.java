package Main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import Main.entity.FilePermission;

@Repository
public interface FilePermissionRepository extends JpaRepository<FilePermission, Integer> {
    List<FilePermission> findByJobJobId(Integer jobId);
    List<FilePermission> findByJobJobIdIn(List<Integer> jobIds);
    boolean existsByJobJobIdAndFilePath(Integer jobId, String filePath);

    @Modifying
    @Transactional
    @Query("DELETE FROM FilePermission fp WHERE fp.job.jobId = :jobId")
    void deleteAllByJobId(@Param("jobId") Integer jobId);
} 