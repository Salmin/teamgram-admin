package com.teamgram.admin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.teamgram.admin.model.User;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class TeamgramService {
    private final WebClient webClient;

    public TeamgramService(@Value("${teamgram.api.url}") String apiUrl) {
        log.info("Initializing TeamgramService with API URL: {}", apiUrl);
        this.webClient = WebClient.builder()
            .baseUrl(apiUrl)
            .build();
    }

    public Flux<User> getAllUsers() {
        log.debug("Fetching all users");
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class)
            .doOnComplete(() -> log.debug("Successfully fetched all users"))
            .onErrorResume(WebClientResponseException.class, e -> {
                if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                    log.warn("No users found");
                    return Flux.empty();
                }
                log.error("Error fetching users: {} - {}", e.getStatusCode(), e.getMessage());
                return Flux.error(e);
            })
            .onErrorResume(Exception.class, e -> {
                log.error("Unexpected error fetching users", e);
                return Flux.error(e);
            });
    }

    public Mono<Void> deleteUser(Long userId) {
        log.debug("Deleting user with ID: {}", userId);
        return webClient.delete()
            .uri("/users/{userId}", userId)
            .retrieve()
            .bodyToMono(Void.class)
            .doOnSuccess(v -> log.debug("Successfully deleted user with ID: {}", userId))
            .onErrorResume(WebClientResponseException.class, e -> {
                if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                    log.warn("User not found for deletion: {}", userId);
                    return Mono.empty();
                }
                log.error("Error deleting user {}: {} - {}", userId, e.getStatusCode(), e.getMessage());
                return Mono.error(e);
            })
            .onErrorResume(Exception.class, e -> {
                log.error("Unexpected error deleting user: {}", userId, e);
                return Mono.error(e);
            });
    }
}
