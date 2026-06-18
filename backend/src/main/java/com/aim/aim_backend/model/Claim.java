package com.aim.aim_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long policyId;

    @Column(name = "claim_number", unique = true)
    private String claimNumber;

    @Column(name = "claim_type")
    private String claimType; // Accident, Theft, Fire, etc.

    @Column(name = "requested_amount", precision = 10, scale = 2)
    private BigDecimal requestedAmount;

    @Column(name = "approved_amount", precision = 10, scale = 2)
    private BigDecimal approvedAmount;

    @Column(name = "deductible", precision = 10, scale = 2)
    private BigDecimal deductible;

    @Column(name = "incident_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime incidentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String status; // PENDING, UNDER_REVIEW, APPROVED, REJECTED, SETTLED
    private String paymentStatus; // PENDING, PROCESSED, COMPLETED

    @Column(length = 10000)
    private String details;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @Column(name = "estimated_amount", precision = 10, scale = 2)
    private BigDecimal estimatedAmount;

    public Claim() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }

    public Claim(Long userId, Long policyId, String claimNumber, String claimType, 
                BigDecimal requestedAmount, BigDecimal approvedAmount, BigDecimal deductible,
                LocalDateTime incidentDate, String details) {
        this();
        this.userId = userId;
        this.policyId = policyId;
        this.claimNumber = claimNumber;
        this.claimType = claimType;
        this.requestedAmount = requestedAmount;
        this.approvedAmount = approvedAmount;
        this.deductible = deductible;
        this.incidentDate = incidentDate;
        this.details = details;
    }

    // Setters with BigDecimal conversion and null safety
    public void setRequestedAmount(Object requestedAmount) {
        if (requestedAmount == null) {
            this.requestedAmount = null;
        } else if (requestedAmount instanceof Number) {
            this.requestedAmount = new BigDecimal(requestedAmount.toString());
        } else if (requestedAmount instanceof String && !((String) requestedAmount).isEmpty()) {
            this.requestedAmount = new BigDecimal((String) requestedAmount);
        } else if (requestedAmount instanceof BigDecimal) {
            this.requestedAmount = (BigDecimal) requestedAmount;
        }
    }

    public void setApprovedAmount(Object approvedAmount) {
        if (approvedAmount == null) {
            this.approvedAmount = null;
        } else if (approvedAmount instanceof Number) {
            this.approvedAmount = new BigDecimal(approvedAmount.toString());
        } else if (approvedAmount instanceof String && !((String) approvedAmount).isEmpty()) {
            this.approvedAmount = new BigDecimal((String) approvedAmount);
        } else if (approvedAmount instanceof BigDecimal) {
            this.approvedAmount = (BigDecimal) approvedAmount;
        }
    }

    public void setEstimatedAmount(Object estimatedAmount) {
        if (estimatedAmount == null) {
            this.estimatedAmount = null;
        } else if (estimatedAmount instanceof Number) {
            this.estimatedAmount = new BigDecimal(estimatedAmount.toString());
        } else if (estimatedAmount instanceof String && !((String) estimatedAmount).isEmpty()) {
            this.estimatedAmount = new BigDecimal((String) estimatedAmount);
        } else if (estimatedAmount instanceof BigDecimal) {
            this.estimatedAmount = (BigDecimal) estimatedAmount;
        }
    }

    public void setDeductible(Object deductible) {
        if (deductible == null) {
            this.deductible = null;
        } else if (deductible instanceof Number) {
            this.deductible = new BigDecimal(deductible.toString());
        } else if (deductible instanceof String && !((String) deductible).isEmpty()) {
            this.deductible = new BigDecimal((String) deductible);
        } else if (deductible instanceof BigDecimal) {
            this.deductible = (BigDecimal) deductible;
        }
    }

    // Standard BigDecimal setters
    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public void setDeductible(BigDecimal deductible) {
        this.deductible = deductible;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }
    
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    
    public String getClaimType() { return claimType; }
    public void setClaimType(String claimType) { this.claimType = claimType; }
    
    public BigDecimal getRequestedAmount() { return requestedAmount; }
    
    public BigDecimal getApprovedAmount() { return approvedAmount; }
    
    public BigDecimal getDeductible() { return deductible; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    

    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getEstimatedAmount() { return estimatedAmount; }
    public void setEstimatedAmount(BigDecimal estimatedAmount) { this.estimatedAmount = estimatedAmount; }
}


