package com.sizzle.backend.config;

import com.sizzle.backend.model.AccountStatus;
import com.sizzle.backend.model.Role;
import com.sizzle.backend.model.User;
import com.sizzle.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default Admin user if none exists
        if (!userRepository.existsByEmail("admin@sizzle.com")) {
            User admin = User.builder()
                    .name("Sizzle Admin")
                    .email("admin@sizzle.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+1 555-0199")
                    .role(Role.ADMIN)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Initialized default ADMIN account: admin@sizzle.com");
        }

        // Seed secondary Admin user (098@gmail.com) if none exists
        if (!userRepository.existsByEmail("098@gmail.com")) {
            User secondAdmin = User.builder()
                    .name("Secondary Admin")
                    .email("098@gmail.com")
                    .password(passwordEncoder.encode("098765"))
                    .phone("+1 555-0987")
                    .role(Role.ADMIN)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(secondAdmin);
            log.info("Initialized secondary ADMIN account: 098@gmail.com");
        }

        // Seed default Customer user if none exists
        if (!userRepository.existsByEmail("customer@sizzle.com")) {
            User customer = User.builder()
                    .name("John Customer")
                    .email("customer@sizzle.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .phone("+1 555-0100")
                    .role(Role.CUSTOMER)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(customer);
            log.info("Initialized default CUSTOMER account: customer@sizzle.com");
        }
    }
}
