package com.aim.aim_backend.dto;

public class ClaimRequest {
    private Long userId;
    private Long policyId;
    private String claimType;
    private String requestedAmount;
    private String approvedAmount;
    private String deductible;
    private String estimatedAmount;
    private String description;
    private String incidentDate;
    private String status;
    private String paymentStatus;
    private String details;
    private String imageUrl;
    private String claimNumber;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getClaimType() { return claimType; }
    public void setClaimType(String claimType) { this.claimType = claimType; }

    public String getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(String requestedAmount) { this.requestedAmount = requestedAmount; }

    public String getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(String approvedAmount) { this.approvedAmount = approvedAmount; }

    public String getDeductible() { return deductible; }
    public void setDeductible(String deductible) { this.deductible = deductible; }

    public String getEstimatedAmount() { return estimatedAmount; }
    public void setEstimatedAmount(String estimatedAmount) { this.estimatedAmount = estimatedAmount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
}