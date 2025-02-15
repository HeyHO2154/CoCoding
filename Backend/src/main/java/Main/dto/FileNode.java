package Main.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

@Getter @Setter
public class FileNode {
    private String name;
    private String path;
    private boolean isDirectory;
    private List<FileNode> children = new ArrayList<>();

    public static FileNode fromFile(File file, String basePath) {
        FileNode node = new FileNode();
        node.setName(file.getName());
        node.setPath(getRelativePath(file, basePath));
        node.setDirectory(file.isDirectory());
        
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                node.setChildren(Arrays.stream(children)
                    .map(child -> fromFile(child, basePath))
                    .collect(Collectors.toList()));
            }
        }
        
        return node;
    }

    private static String getRelativePath(File file, String basePath) {
        String absolutePath = file.getAbsolutePath();
        return absolutePath.substring(basePath.length() + 1)
            .replace("\\", "/");
    }
} 