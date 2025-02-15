package Main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "FilePermissions")
@Getter @Setter
public class FilePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Integer permissionId;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "created_by")
    private String createdBy;
} 