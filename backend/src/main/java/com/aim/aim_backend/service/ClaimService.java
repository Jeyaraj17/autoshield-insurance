package com.aim.aim_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aim.aim_backend.model.Claim;
import com.aim.aim_backend.model.User;
import com.aim.aim_backend.repository.ClaimRepository;
import com.aim.aim_backend.repository.UserRepository;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public Claim submitClaim(Claim claim, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        claim.setUserId(user.getId());
        claim.setStatus("PENDING");
        claim.setPaymentStatus("RECEIVED");
        
        // Ensure createdAt is set
        if (claim.getCreatedAt() == null) {
            claim.setCreatedAt(java.time.LocalDateTime.now());
        }
        
        // Generate claim number if not set
        if (claim.getClaimNumber() == null || claim.getClaimNumber().isEmpty()) {
            claim.setClaimNumber("CLM" + System.currentTimeMillis());
        }
        
        System.out.println("Saving claim with auth - Type: " + claim.getClaimType() + ", UserId: " + claim.getUserId());
        
        try {
            return claimRepository.save(claim);
        } catch (Exception e) {
            System.err.println("Error saving claim with auth: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save claim: " + e.getMessage());
        }
    }

    public List<Claim> getClaimsByUserId(Long userId) {
        if (userId != null) {
            return claimRepository.findByUserId(userId);
        }
        return claimRepository.findAll();
    }

    public List<Claim> getClaimsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return claimRepository.findByUserId(user.getId());
    }

    public Claim updateClaimStatus(Long id, String status) {
        Claim claim = claimRepository.findById(id).orElseThrow();
        claim.setStatus(status);
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim submitClaimWithUserId(Claim claim) {
        // Validate required fields
        if (claim.getUserId() == null) {
            throw new RuntimeException("User ID is required for claim submission");
        }
        if (claim.getPolicyId() == null) {
            throw new RuntimeException("Policy ID is required for claim submission");
        }
        if (claim.getClaimType() == null || claim.getClaimType().trim().isEmpty()) {
            throw new RuntimeException("Claim type is required for claim submission");
        }
        
        // Set default values
        claim.setStatus("PENDING");
        claim.setPaymentStatus("RECEIVED");
        
        // Ensure createdAt is set
        if (claim.getCreatedAt() == null) {
            claim.setCreatedAt(java.time.LocalDateTime.now());
        }
        
        // Generate claim number if not set
        if (claim.getClaimNumber() == null || claim.getClaimNumber().isEmpty()) {
            claim.setClaimNumber("CLM" + System.currentTimeMillis());
        }
        
        System.out.println("Saving claim - Type: " + claim.getClaimType() + ", UserId: " + claim.getUserId() + ", PolicyId: " + claim.getPolicyId());
        System.out.println("Claim details - RequestedAmount: " + claim.getRequestedAmount() + ", EstimatedAmount: " + claim.getEstimatedAmount());
        
        try {
            Claim saved = claimRepository.save(claim);
            System.out.println("Claim saved successfully with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("Error saving claim: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save claim: " + e.getMessage());
        }
    }
}