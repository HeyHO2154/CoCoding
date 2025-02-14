package Main.repository;

import Main.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
    // 기본 CRUD 메서드는 JpaRepository에서 제공
} 