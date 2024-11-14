package com.teamgram.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Разрешаем запросы с frontend
        config.addAllowedOrigin("https://admin.salmin.in");
        
        // Разрешаем основные HTTP методы
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // Разрешаем заголовки
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("Content-Type");
        config.addAllowedHeader("Accept");
        config.addAllowedHeader("X-Requested-With");
        config.addAllowedHeader("remember-me");
        config.addAllowedHeader("Origin");
        config.addAllowedHeader("Access-Control-Request-Method");
        config.addAllowedHeader("Access-Control-Request-Headers");
        
        // Разрешаем отправку credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Устанавливаем максимальное время жизни preflight запросов
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
