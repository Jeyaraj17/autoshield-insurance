package com.aim.aim_backend.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aim.aim_backend.model.UserQuery;
import com.aim.aim_backend.service.UserQueryService;

@RestController
@RequestMapping("/api/queries")
public class UserQueryController {

    private final UserQueryService userQueryService;

    public UserQueryController(UserQueryService userQueryService) {
        this.userQueryService = userQueryService;
    }

    @PostMapping
    public ResponseEntity<UserQuery> submit(@RequestBody UserQuery q) {
        return ResponseEntity.ok(userQueryService.submitQuery(q));
    }

    @GetMapping
    public ResponseEntity<List<UserQuery>> list(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(userQueryService.getQueriesByUserId(userId));
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<UserQuery> reply(@PathVariable Long id, @RequestParam String response, @RequestParam(defaultValue = "RESOLVED") String status) {
        return ResponseEntity.ok(userQueryService.replyToQuery(id, response, status));
    }
}


