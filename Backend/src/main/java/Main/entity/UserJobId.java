package Main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter @Setter
public class UserJobId implements Serializable {
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "job_id")
    private Integer jobId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserJobId that = (UserJobId) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(jobId, that.jobId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, jobId);
    }
} 