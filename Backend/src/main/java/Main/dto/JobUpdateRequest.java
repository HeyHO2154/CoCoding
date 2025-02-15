package Main.dto;

import Main.entity.Job;
import java.util.List;

public class JobUpdateRequest {
    private Job job;
    private List<FilePermissionDTO> filePermissions;

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
    public List<FilePermissionDTO> getFilePermissions() { return filePermissions; }
    public void setFilePermissions(List<FilePermissionDTO> filePermissions) { this.filePermissions = filePermissions; }
} 