package com.aim.aim_backend.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.model.Policy;
import com.aim.aim_backend.service.PolicyService;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    public ResponseEntity<Policy> create(@RequestBody PolicyRequest request) {
        try {
            System.out.println("Policy creation request received: " + request.getPolicyName());
            Policy policy = policyService.createPolicy(request);
            return ResponseEntity.ok(policy);
        } catch (Exception e) {
            System.out.println("Policy creation error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<Policy>> all() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Policy controller is working");
    }

    // DTO for policy creation request
    public static class PolicyRequest {
        private String policyName;
        private String vehicleType;
        private String coverageType;
        private String premiumAmount;
        private String coverageAmount;
        private Integer duration;
        private String description;
        private String benefits;
        private String terms;
        private Boolean isActive = true;
        private Long createdByAdmin;

        // Getters and Setters
        public String getPolicyName() { return policyName; }
        public void setPolicyName(String policyName) { this.policyName = policyName; }

        public String getVehicleType() { return vehicleType; }
        public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

        public String getCoverageType() { return coverageType; }
        public void setCoverageType(String coverageType) { this.coverageType = coverageType; }

        public String getPremiumAmount() { return premiumAmount; }
        public void setPremiumAmount(String premiumAmount) { this.premiumAmount = premiumAmount; }

        public String getCoverageAmount() { return coverageAmount; }
        public void setCoverageAmount(String coverageAmount) { this.coverageAmount = coverageAmount; }

        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getBenefits() { return benefits; }
        public void setBenefits(String benefits) { this.benefits = benefits; }

        public String getTerms() { return terms; }
        public void setTerms(String terms) { this.terms = terms; }

        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }

        public Long getCreatedByAdmin() { return createdByAdmin; }
        public void setCreatedByAdmin(Long createdByAdmin) { this.createdByAdmin = createdByAdmin; }
    }
}


