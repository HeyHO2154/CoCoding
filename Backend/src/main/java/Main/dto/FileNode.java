package Main.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;

@Getter @Setter
public class FileNode {
    private String path;
    private String name;
    private boolean isDirectory;
    private List<FileNode> children = new ArrayList<>();
} 