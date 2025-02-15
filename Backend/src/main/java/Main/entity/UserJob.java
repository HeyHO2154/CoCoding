package Main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserJobs")
@Getter @Setter
public class UserJob {
    @EmbeddedId
    private UserJobId id;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "assigned_by")
    private String assignedBy;
} 