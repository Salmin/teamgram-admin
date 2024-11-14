package com.teamgram.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${cors.exposed-headers}")
    private String exposedHeaders;

    @Value("${cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${cors.max-age}")
    private long maxAge;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Разрешаем запросы с frontend
        config.setAllowedOrigins(List.of(allowedOrigins));
        
        // Разрешаем HTTP методы
        config.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));
        
        // Разрешаем все стандартные заголовки
        config.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        
        // Добавляем дополнительные заголовки для Keycloak
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("X-Requested-With");
        config.addAllowedHeader("remember-me");
        config.addAllowedHeader("Origin");
        config.addAllowedHeader("Access-Control-Request-Method");
        config.addAllowedHeader("Access-Control-Request-Headers");
        config.addAllowedHeader("Accept");
        config.addAllowedHeader("Cache-Control");
        config.addAllowedHeader("Content-Type");
        
        // Разрешаем exposed headers
        config.setExposedHeaders(Arrays.asList(exposedHeaders.split(",")));
        
        // Разрешаем credentials
        config.setAllowCredentials(allowCredentials);
        
        // Устанавливаем max age для preflight requests
        config.setMaxAge(maxAge);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
