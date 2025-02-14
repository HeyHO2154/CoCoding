package Main.dto;

import Main.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserResponse {
    private String userId;
    private String name;
    private String role;
    
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.role = user.getRole();
    }
} 