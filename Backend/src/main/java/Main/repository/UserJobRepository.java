package Main.repository;

import Main.entity.UserJob;
import Main.entity.UserJobId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface UserJobRepository extends JpaRepository<UserJob, UserJobId> {
    // 기본 CRUD 메서드는 JpaRepository에서 제공
    UserJob findTopByIdJobIdOrderByAssignedAtDesc(Integer jobId);  // jobId -> id.jobId
    
    @Query("DELETE FROM UserJob uj WHERE uj.id.userId = :userId")
    @Modifying
    @Transactional
    void deleteAllByUserId(@Param("userId") String userId);

    List<UserJob> findByIdUserId(String userId);  // 추가

    void deleteByIdJobId(Integer jobId);  // 추가
} 