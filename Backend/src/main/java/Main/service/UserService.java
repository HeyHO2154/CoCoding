package Main.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Main.repository.UserRepository;
import Main.entity.User;
import Main.dto.UserResponse;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    public UserResponse login(String userId, String password) {
        logger.info("Login attempt for user: {}, password: {}", userId, password);
        
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> {
                logger.error("User not found: {}", userId);
                return new RuntimeException("User not found");
            });
            
        logger.info("User found: {}, stored password: {}", user.getUserId(), user.getPassword());
        
        // 단순 문자열 비교
        if (!password.equals(user.getPassword())) {
            logger.error("Invalid password for user: {}", userId);
            throw new RuntimeException("Invalid password");
        }
        
        logger.info("Login successful for user: {}", userId);
        return new UserResponse(user);
    }
} 