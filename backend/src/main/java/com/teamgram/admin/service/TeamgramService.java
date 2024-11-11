package com.teamgram.admin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.teamgram.admin.model.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TeamgramService {
    private final WebClient webClient;

    public TeamgramService(@Value("${teamgram.api.url}") String apiUrl) {
        this.webClient = WebClient.builder()
            .baseUrl(apiUrl)
            .build();
    }

    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);
    }

    public Mono<Void> deleteUser(Long userId) {
        return webClient.delete()
            .uri("/users/{userId}", userId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
