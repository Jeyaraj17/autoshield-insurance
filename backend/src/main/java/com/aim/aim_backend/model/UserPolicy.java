package com.aim.aim_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_policies")
public class UserPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String type;

    @Column(length = 4000)
    private String details; // vehicleNumber, model, insuranceType, duration

    public UserPolicy() {}

    public UserPolicy(Long id, Long userId, String type, String details) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.details = details;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}


