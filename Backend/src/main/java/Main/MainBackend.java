package Main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"Main", "Main.controller", "Main.config", "Main.service"})
public class MainBackend {

	public static void main(String[] args) {
		SpringApplication.run(MainBackend.class, args);
	}

}
