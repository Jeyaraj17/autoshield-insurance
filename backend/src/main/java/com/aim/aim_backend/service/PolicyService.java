package com.aim.aim_backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aim.aim_backend.model.Policy;
import com.aim.aim_backend.repository.PolicyRepository;
import com.aim.aim_backend.web.PolicyController.PolicyRequest;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public Policy createPolicy(PolicyRequest request) {
        Policy policy = new Policy(
            request.getPolicyName(),
            request.getVehicleType(),
            request.getCoverageType(),
            new BigDecimal(request.getPremiumAmount()),
            new BigDecimal(request.getCoverageAmount()),
            request.getDuration(),
            request.getDescription(),
            request.getBenefits(),
            request.getTerms(),
            request.getCreatedByAdmin()
        );
        
        policy.setUpdatedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
}