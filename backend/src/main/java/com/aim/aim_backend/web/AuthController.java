package com.aim.aim_backend.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.model.Role;
import com.aim.aim_backend.model.User;
import com.aim.aim_backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String result = authService.register(request);
            return ResponseEntity.status(201).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        }
    }

    // alias for clients expecting /signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody RegisterRequest request) {
        return register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            User user = authService.getCurrentUser(request.getEmail());
            return ResponseEntity.ok(new LoginResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), token));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(new MeResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private Role role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String token;

        public LoginResponse(Long id, String name, String email, String role, String token) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.token = token;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getToken() { return token; }
    }

    public static class MeResponse {
        private Long id;
        private String name;
        private String email;
        private String role;

        public MeResponse(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}
