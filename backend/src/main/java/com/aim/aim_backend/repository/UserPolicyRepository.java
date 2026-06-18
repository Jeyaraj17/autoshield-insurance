package com.aim.aim_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aim.aim_backend.model.UserPolicy;

public interface UserPolicyRepository extends JpaRepository<UserPolicy, Long> {
    List<UserPolicy> findByUserId(Long userId);
}


