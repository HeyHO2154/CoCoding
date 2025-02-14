package Main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Entity
@Table(name = "Users")
@Getter @Setter
public class User {
    @Id
    private String userId;
    
    private String password;
    private String name;
    
    @Column(name = "role")
    private String role;
    
    private Timestamp createdAt;
    private Timestamp lastLogin;
} 