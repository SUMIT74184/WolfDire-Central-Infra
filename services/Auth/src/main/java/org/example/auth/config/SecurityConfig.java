package org.example.auth.config;

import lombok.RequiredArgsConstructor;
import org.example.auth.services.CustomOAuth2UserService;
import org.example.auth.services.UserDetailsServiceImpl;
import org.example.auth.utils.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.*;

/**
 * SecurityConfig: The master control panel for all security in the application.
 * 
 * KEY CONCEPTS:
 * 1. PasswordEncoder: Hashes passwords with BCrypt (2^10 = 1024 rounds)
 * 2. AuthenticationProvider: Tells Spring Security HOW to verify credentials
 * 3. SecurityFilterChain: Defines which URLs need auth, which are public
 * 4. JwtAuthenticationFilter: Runs BEFORE every request to check JWT tokens
 * 5. OAuth2: Google/Facebook/Apple login configuration
 * 
 * STATELESS SESSION:
 * SessionCreationPolicy.STATELESS = no server-side sessions.
 * All auth state is in the JWT token. Server never stores "who is logged in".
 * This allows horizontal scaling — any server can validate any token.
 * 
 * @EnableMethodSecurity: Allows @PreAuthorize on controller methods.
 *                        Example: @PreAuthorize("hasRole('ADMIN')") on a method
 *                        = only ADMIN role can call it.
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler auth2LoginSuccessHandler;

    /**
     * DaoAuthenticationProvider: Tells Spring Security how to verify user
     * credentials.
     * 
     * When user calls POST /login with email + password:
     * 1. Spring calls userDetailsService.loadUserByUsername(email)
     * 2. Gets the User entity (which includes BCrypt hashed password)
     * 3. Calls passwordEncoder.matches(rawPassword, hashedPassword)
     * 4. If match → authentication succeeds → generate JWT
     * 5. If no match → throw AuthenticationException → return 401
     */

    @Bean
    public AuthenticationProvider authenticationProvider(
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    /**
     * AuthenticationManager: The coordinator for all authentication providers.
     * Used by AuthService.login() to validate credentials.
     */

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * CORS: Allows frontend (localhost:3000) to call backend (localhost:8081).
     * 
     * Without CORS, browser blocks the request with:
     * "Access to fetch at `http://localhost:8081/api/auth/login` from origin
     * 'http://localhost:3000' has been blocked by CORS policy"
     * 
     * In production, replace "*" with your actual frontend domain.
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;

    }

    /**
     * SecurityFilterChain: THE MOST IMPORTANT METHOD.
     * Defines the entire security policy for the application.
     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        http
                // CSRF disabled: JWT authentication is immune to CSRF attacks
                // (attacker can't steal JWT from another domain due to CORS + SameSite cookies)
                .csrf(csfr -> csfr.disable())

                // CORS: Disabled here — handled by the API Gateway to avoid duplicate headers
                .cors(cors -> cors.disable())

                // URL Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // Allow all OPTIONS requests (preflight)
                        .requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.OPTIONS, "/**")).permitAll()
                        
                        // PUBLIC ENDPOINTS — no authentication required
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/register")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/login")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/refresh")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/forgot-password")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/reset-password")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/api/auth/verify-email")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/actuator/**")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/oauth2/**")).permitAll()
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/login/oauth2/**")).permitAll()

                        // All Other endpoints - require authentication
                        .anyRequest().authenticated())

                // Return 401 JSON for unauthenticated API requests instead of 302 redirect
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(401);
                            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                        }))

                // oAuth2 Login Configuration
                .oauth2Login(oauth2 -> oauth2
                        // Custom user service to load/create users from OAuth2 data
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))
                        // Success handler generated JWT and redirects to frontend
                        .successHandler(auth2LoginSuccessHandler)
                        // Failure handler (default is fine - redirects to /login/error)
                        .failureUrl("/api/auth/oauth2/error")

                )
                // STATELESS: No server-side sessions.
                // Every request is authenticated via JWT in the Authorization header.
                // This allows horizontal scaling — any server can handle any request.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // wire in our custom authentication provider
                .authenticationProvider(authenticationProvider)

                // JWT Filter: Runs BEFORE UsernamePasswordAuthenticationFilter
                // Extracts JWT from Authorization header, validates it, sets SecurityContext

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();

    }

}
