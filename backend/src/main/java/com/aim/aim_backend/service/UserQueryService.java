package com.aim.aim_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aim.aim_backend.model.UserQuery;
import com.aim.aim_backend.repository.UserQueryRepository;

@Service
public class UserQueryService {

    private final UserQueryRepository userQueryRepository;

    public UserQueryService(UserQueryRepository userQueryRepository) {
        this.userQueryRepository = userQueryRepository;
    }

    public UserQuery submitQuery(UserQuery query) {
        query.setStatus("OPEN");
        return userQueryRepository.save(query);
    }

    public List<UserQuery> getQueriesByUserId(Long userId) {
        if (userId != null) {
            return userQueryRepository.findByUserId(userId);
        }
        return userQueryRepository.findAll();
    }

    public UserQuery replyToQuery(Long id, String response, String status) {
        UserQuery query = userQueryRepository.findById(id).orElseThrow();
        query.setResponse(response);
        query.setStatus(status);
        return userQueryRepository.save(query);
    }
}