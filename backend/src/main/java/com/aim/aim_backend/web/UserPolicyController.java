package com.aim.aim_backend.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.model.UserPolicy;
import com.aim.aim_backend.service.UserPolicyService;

@RestController
@RequestMapping("/api/user-policies")
public class UserPolicyController {

    private final UserPolicyService userPolicyService;

    public UserPolicyController(UserPolicyService userPolicyService) {
        this.userPolicyService = userPolicyService;
    }

    @PostMapping
    public ResponseEntity<?> apply(Authentication auth, @RequestBody UserPolicy req) {
        try {
            System.out.println("Policy application request received");
            System.out.println("Auth object: " + auth);
            System.out.println("Request body: " + req);
            
            if (auth == null || auth.getName() == null) {
                System.err.println("Authentication failed - no auth or username");
                return ResponseEntity.status(401).body("Please login to apply for policies");
            }
            
            System.out.println("Authenticated user: " + auth.getName());
            UserPolicy up = userPolicyService.applyPolicy(auth.getName(), req);
            System.out.println("Policy application successful: " + up.getId());
            return ResponseEntity.ok(up);
        } catch (Exception e) {
            System.err.println("Policy application error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> myPolicies(Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return ResponseEntity.status(401).body("Please login to view policies");
            }
            return ResponseEntity.ok(userPolicyService.getUserPolicies(auth.getName()));
        } catch (Exception e) {
            System.err.println("Get policies error: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test(Authentication auth) {
        System.out.println("Test endpoint called");
        System.out.println("Auth: " + auth);
        if (auth != null) {
            System.out.println("Auth name: " + auth.getName());
        }
        return ResponseEntity.ok("UserPolicy controller is working. Auth: " + (auth != null ? auth.getName() : "null"));
    }
}


