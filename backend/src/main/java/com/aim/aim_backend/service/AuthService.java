package com.aim.aim_backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aim.aim_backend.model.Role;
import com.aim.aim_backend.model.User;
import com.aim.aim_backend.repository.UserRepository;
import com.aim.aim_backend.web.AuthController.LoginRequest;
import com.aim.aim_backend.web.AuthController.RegisterRequest;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        User user = new User(null,
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getRole() != null ? request.getRole() : Role.USER);
        userRepository.save(user);
        return "Registered successfully";
    }

    public User login(LoginRequest request, HttpServletRequest httpRequest) {
        try {
            var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            var session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Invalid credentials");
        }
        return userRepository.findByEmail(request.getEmail()).orElseThrow();
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }
}