package com.aim.aim_backend.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.model.User;
import com.aim.aim_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName()).orElseThrow();
            
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                user.setName(request.getName().trim());
            }
            
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                if (!request.getEmail().equals(user.getEmail()) && 
                    userRepository.existsByEmail(request.getEmail())) {
                    return ResponseEntity.badRequest().body("Email already exists");
                }
                user.setEmail(request.getEmail().trim());
            }
            
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(new ProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    public static class UpdateProfileRequest {
        private String name;
        private String email;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ProfileResponse {
        private Long id;
        private String name;
        private String email;
        private String role;

        public ProfileResponse(Long id, String name, String email, String role) {
            this.id = id; this.name = name; this.email = email; this.role = role;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}