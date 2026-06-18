package com.aim.aim_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aim.aim_backend.model.UserQuery;

public interface UserQueryRepository extends JpaRepository<UserQuery, Long> {
    List<UserQuery> findByUserId(Long userId);
}


