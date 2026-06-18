package com.aim.aim_backend.web;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.dto.ClaimRequest;
import com.aim.aim_backend.model.Claim;
import com.aim.aim_backend.service.ClaimService;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ClaimRequest request) {
        try {
            System.out.println("=== CLAIM SUBMISSION DEBUG ===");
            System.out.println("Request received - ClaimType: " + request.getClaimType());
            System.out.println("UserId: " + request.getUserId());
            System.out.println("PolicyId: " + request.getPolicyId());
            System.out.println("Description: " + request.getDescription());
            System.out.println("EstimatedAmount: " + request.getEstimatedAmount());
            
            // Convert DTO to Entity
            Claim claim = new Claim();
            claim.setUserId(request.getUserId());
            claim.setPolicyId(request.getPolicyId());
            claim.setClaimType(request.getClaimType());
            claim.setDescription(request.getDescription());
            claim.setDetails(request.getDetails());
            claim.setImageUrl(request.getImageUrl());
            claim.setClaimNumber(request.getClaimNumber());
            
            // Handle amounts with null checks
            if (request.getRequestedAmount() != null && !request.getRequestedAmount().isEmpty()) {
                claim.setRequestedAmount(new BigDecimal(request.getRequestedAmount()));
            }
            if (request.getApprovedAmount() != null && !request.getApprovedAmount().isEmpty()) {
                claim.setApprovedAmount(new BigDecimal(request.getApprovedAmount()));
            }
            if (request.getDeductible() != null && !request.getDeductible().isEmpty()) {
                claim.setDeductible(new BigDecimal(request.getDeductible()));
            }
            if (request.getEstimatedAmount() != null && !request.getEstimatedAmount().isEmpty()) {
                claim.setEstimatedAmount(new BigDecimal(request.getEstimatedAmount()));
            }
            
            // Handle incident date
            if (request.getIncidentDate() != null && !request.getIncidentDate().isEmpty()) {
                try {
                    claim.setIncidentDate(LocalDateTime.parse(request.getIncidentDate()));
                } catch (Exception e) {
                    // Try parsing as date only
                    claim.setIncidentDate(java.time.LocalDate.parse(request.getIncidentDate().split("T")[0]).atStartOfDay());
                }
            }
            
            // Always use submitClaimWithUserId since auth is not reliable
            Claim savedClaim = claimService.submitClaimWithUserId(claim);
            
            return ResponseEntity.ok(savedClaim);
        } catch (Exception e) {
            System.err.println("Claim submission error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Claim>> myClaims(@Nullable Authentication auth, @RequestParam(required = false) Long userId) {
        if (auth != null && auth.getName() != null && userId == null) {
            // For regular users, get their own claims
            return ResponseEntity.ok(claimService.getClaimsByUserEmail(auth.getName()));
        }
        return ResponseEntity.ok(claimService.getClaimsByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Claim> setStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Claims controller is working");
    }
    
    @PostMapping("/test-post")
    public ResponseEntity<String> testPost(@RequestBody String body) {
        System.out.println("Received body: " + body);
        return ResponseEntity.ok("Post test successful: " + body);
    }
}


