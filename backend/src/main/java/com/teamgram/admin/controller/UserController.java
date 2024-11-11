package com.teamgram.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamgram.admin.model.User;
import com.teamgram.admin.service.TeamgramService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final TeamgramService teamgramService;

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN_VIEW')")
    public Flux<User> getAllUsers() {
        return teamgramService.getAllUsers();
    }

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('ADMIN_DELETE')")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long userId) {
        return teamgramService.deleteUser(userId)
            .then(Mono.just(ResponseEntity.ok().<Void>build()))
            .onErrorReturn(ResponseEntity.internalServerError().build());
    }
}
