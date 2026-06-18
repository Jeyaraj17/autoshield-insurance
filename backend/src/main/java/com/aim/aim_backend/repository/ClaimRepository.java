package com.aim.aim_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aim.aim_backend.model.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByUserId(Long userId);
}


