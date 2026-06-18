package com.aim.aim_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aim.aim_backend.model.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
}


