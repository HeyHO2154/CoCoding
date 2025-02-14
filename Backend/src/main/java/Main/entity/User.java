package Main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {
    @Id
    private String userId;
    
    private String password;
    private String name;
    
    @Column(name = "level")
    private String level;
} 