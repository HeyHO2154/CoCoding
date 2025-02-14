package Main.dto;

import Main.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserResponse {
    private String userId;
    private String name;
    private String level;
    
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.level = user.getLevel();
    }
} 