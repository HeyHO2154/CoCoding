package Main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Main.dto.FileNode;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileStructureController {
    
    @GetMapping("/structure")
    public ResponseEntity<List<FileNode>> getFileStructure() {
        String currentDir = System.getProperty("user.dir");
        File projectRoot = new File(currentDir).getParentFile();
        
        // 최상위 폴더들 (Frontend, Backend 등)을 직접 생성
        List<FileNode> structure = new ArrayList<>();
        File[] rootFiles = projectRoot.listFiles();
        
        if (rootFiles != null) {
            for (File file : rootFiles) {
                if (file.isDirectory() && !shouldExclude(file.getName())) {
                    FileNode node = new FileNode();
                    node.setPath(file.getPath().replace("\\", "/"));
                    node.setName(file.getName());
                    node.setDirectory(true);  // 명시적으로 디렉토리로 설정
                    node.setChildren(buildFileStructure(file));
                    structure.add(node);
                }
            }
        }
        
        return ResponseEntity.ok(structure);
    }

    private List<FileNode> buildFileStructure(File directory) {
        File[] files = directory.listFiles();
        if (files == null) return new ArrayList<>();

        List<FileNode> nodes = new ArrayList<>();
        for (File file : files) {
            if (shouldExclude(file.getName())) continue;

            FileNode node = new FileNode();
            node.setPath(file.getPath().replace("\\", "/"));
            node.setName(file.getName());
            node.setDirectory(file.isDirectory());
            if (file.isDirectory()) {
                node.setChildren(buildFileStructure(file));
            }
            nodes.add(node);
        }
        return nodes;
    }

    private boolean shouldExclude(String name) {
        return name.equals("node_modules") || 
               name.equals(".git") || 
               name.equals("target") ||
               name.startsWith(".");
    }
} 