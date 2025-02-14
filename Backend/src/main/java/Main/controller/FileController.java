package Main.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class FileController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    private final String PROJECT_DIR = "C:\\Users\\PRO\\Desktop\\GitDesktop\\CoCoding\\";

    // 📂 1. 계층적 폴더 & 파일 구조 반환
    @GetMapping("/files")
    public ResponseEntity<List<Map<String, Object>>> getFiles() {
        try {
            logger.info("Fetching file tree from: {}", PROJECT_DIR);
            File root = new File(PROJECT_DIR);
            if (!root.exists() || !root.isDirectory()) {
                logger.error("Project directory not found: {}", PROJECT_DIR);
                return ResponseEntity.badRequest().body(List.of(Map.of("error", "Project 폴더가 없습니다.")));
            }
            List<Map<String, Object>> structure = getDirectoryStructure(root);
            logger.info("File tree fetched successfully");
            return ResponseEntity.ok(structure);
        } catch (Exception e) {
            logger.error("Error fetching file tree: ", e);
            return ResponseEntity.internalServerError().body(List.of(Map.of("error", "파일 구조 조회 중 오류가 발생했습니다.")));
        }
    }

    // 📄 2. 특정 파일 내용 조회
    @GetMapping("/file")
    public ResponseEntity<String> readFile(@RequestParam String path) {
        logger.info("Reading file: {}", path);
        File file = new File(PROJECT_DIR + path);
        if (!file.exists() || file.isDirectory()) {
            logger.error("File not found or is directory: {}", path);
            return ResponseEntity.badRequest().body("파일이 존재하지 않거나 폴더입니다.");
        }
        try {
            String content = Files.readString(file.toPath());
            logger.info("File read successfully: {}", path);
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            logger.error("Error reading file: {}", path, e);
            return ResponseEntity.internalServerError().body("파일 읽기 오류");
        }
    }

    // 📝 3. 파일 수정
    @PutMapping("/file")
    public ResponseEntity<String> updateFile(@RequestParam String path, @RequestBody String newContent) {
        logger.info("Updating file: {}", path);
        File file = new File(PROJECT_DIR + path);
        if (!file.exists() || file.isDirectory()) {
            logger.error("File not found or is directory: {}", path);
            return ResponseEntity.badRequest().body("파일이 존재하지 않거나 폴더입니다.");
        }
        try {
            Files.writeString(file.toPath(), newContent, StandardOpenOption.TRUNCATE_EXISTING);
            logger.info("File updated successfully: {}", path);
            return ResponseEntity.ok("파일이 성공적으로 업데이트되었습니다.");
        } catch (IOException e) {
            logger.error("Error updating file: {}", path, e);
            return ResponseEntity.internalServerError().body("파일 수정 오류");
        }
    }

    // 🗂️ 계층적 폴더 구조 JSON 반환
    private List<Map<String, Object>> getDirectoryStructure(File dir) {
        List<Map<String, Object>> result = new ArrayList<>();
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (!file.getName().startsWith(".")) {  // 숨김 파일 제외
                    Map<String, Object> fileData = new HashMap<>();
                    fileData.put("name", file.getName());
                    fileData.put("path", file.getAbsolutePath().replace(PROJECT_DIR, "")); // 상대 경로 저장
                    fileData.put("isDirectory", file.isDirectory());

                    if (file.isDirectory()) {
                        fileData.put("children", getDirectoryStructure(file));
                    }

                    result.add(fileData);
                }
            }
        }
        return result;
    }
} 