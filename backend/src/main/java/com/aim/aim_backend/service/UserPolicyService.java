package com.aim.aim_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aim.aim_backend.model.User;
import com.aim.aim_backend.model.UserPolicy;
import com.aim.aim_backend.repository.UserPolicyRepository;
import com.aim.aim_backend.repository.UserRepository;

@Service
public class UserPolicyService {

    private final UserPolicyRepository userPolicyRepository;
    private final UserRepository userRepository;

    public UserPolicyService(UserPolicyRepository userPolicyRepository, UserRepository userRepository) {
        this.userPolicyRepository = userPolicyRepository;
        this.userRepository = userRepository;
    }

    public UserPolicy applyPolicy(String userEmail, UserPolicy req) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        UserPolicy up = new UserPolicy(null, user.getId(), req.getType(), req.getDetails());
        return userPolicyRepository.save(up);
    }

    public List<UserPolicy> getUserPolicies(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return userPolicyRepository.findByUserId(user.getId());
    }
}