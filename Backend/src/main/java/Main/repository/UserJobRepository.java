package Main.repository;

import Main.entity.UserJob;
import Main.entity.UserJobId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserJobRepository extends JpaRepository<UserJob, UserJobId> {
    // 기본 CRUD 메서드는 JpaRepository에서 제공
    UserJob findTopByIdJobIdOrderByAssignedAtDesc(Integer jobId);  // jobId -> id.jobId
} 