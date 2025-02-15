package Main.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class JobAssignmentDTO {
    private String userId;
    private String userName;  // 담당자 이름
    private String assignedBy;  // 배정한 사람
    private LocalDateTime assignedAt;
} 