package com.aim.aim_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_queries")
public class UserQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 2000)
    private String queryText;

    @Column(length = 2000)
    private String response;

    private String status; // OPEN, RESOLVED

    public UserQuery() {}

    public UserQuery(Long id, Long userId, String queryText, String response, String status) {
        this.id = id;
        this.userId = userId;
        this.queryText = queryText;
        this.response = response;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getQueryText() { return queryText; }
    public void setQueryText(String queryText) { this.queryText = queryText; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}


