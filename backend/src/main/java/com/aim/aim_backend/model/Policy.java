package com.aim.aim_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_name", nullable = false)
    private String policyName;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // Two-Wheeler, Four-Wheeler

    @Column(name = "coverage_type", nullable = false)
    private String coverageType; // Comprehensive, Third-Party, etc.

    @Column(name = "premium_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal premiumAmount;

    @Column(name = "coverage_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal coverageAmount;

    @Column(nullable = false)
    private Integer duration; // in months

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String benefits;

    @Column(length = 2000)
    private String terms;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_by_admin")
    private Long createdByAdmin; // admin user id

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Policy() {
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }

    public Policy(String policyName, String vehicleType, String coverageType, 
                 BigDecimal premiumAmount, BigDecimal coverageAmount, Integer duration,
                 String description, String benefits, String terms, Long createdByAdmin) {
        this();
        this.policyName = policyName;
        this.vehicleType = vehicleType;
        this.coverageType = coverageType;
        this.premiumAmount = premiumAmount;
        this.coverageAmount = coverageAmount;
        this.duration = duration;
        this.description = description;
        this.benefits = benefits;
        this.terms = terms;
        this.createdByAdmin = createdByAdmin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyName() { return policyName; }
    public void setPolicyName(String policyName) { this.policyName = policyName; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getCoverageType() { return coverageType; }
    public void setCoverageType(String coverageType) { this.coverageType = coverageType; }

    public BigDecimal getPremiumAmount() { return premiumAmount; }
    public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }

    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Legacy getters for backward compatibility
    public String getType() { return vehicleType; }
    public void setType(String type) { this.vehicleType = type; }
    public String getDetails() { return description; }
    public void setDetails(String details) { this.description = details; }
}


