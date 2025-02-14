package Main.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Main.repository.UserRepository;
import Main.entity.User;
import Main.dto.UserResponse;
import java.sql.Timestamp;
import java.util.List;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    public UserResponse login(String userId, String password) {
        logger.info("Login attempt for user: {}", userId);
        
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> {
                logger.error("User not found: {}", userId);
                return new RuntimeException("User not found");
            });
            
        if (!password.equals(user.getPassword())) {
            logger.error("Invalid password for user: {}", userId);
            throw new RuntimeException("Invalid password");
        }
        
        // 로그인 시간 업데이트
        user.setLastLogin(new Timestamp(System.currentTimeMillis()));
        userRepository.save(user);
        
        logger.info("Login successful for user: {}", userId);
        return new UserResponse(user);  // UserResponse 객체 반환
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public User updateUser(String userId, User updatedUser) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        user.setRole(updatedUser.getRole());
        return userRepository.save(user);
    }
} 