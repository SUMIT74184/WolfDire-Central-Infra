package com.app.socialconnection.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * 🎓 LEARNING: JWT Authentication Filter
 *
 * In a microservice architecture, authentication typically works like this:
 *
 * 1. User logs in via Auth Service → gets a JWT token
 * 2. Client sends JWT in the "Authorization: Bearer <token>" header
 * 3. API Gateway validates the token (optional first layer)
 * 4. Each microservice has a filter like this that:
 *    a) Extracts the token from the header
 *    b) Parses it to get the userId
 *    c) Sets the userId as a request attribute
 *    d) Controllers access it via request.getAttribute("userId")
 *
 * OncePerRequestFilter ensures this filter runs exactly once per request
 * (even if the request is forwarded internally).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            try {
                byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
                SecretKey key = Keys.hmacShaKeyFor(keyBytes);

                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Extract userId from the custom "userId" claim instead of subject (which is email)
                Object userIdObj = claims.get("userId");
                Long userId = null;
                if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).longValue();
                } else if (userIdObj instanceof String) {
                    userId = Long.parseLong((String) userIdObj);
                }
                
                if (userId != null) {
                    request.setAttribute("userId", userId);
                } else {
                    throw new RuntimeException("userId claim missing in JWT");
                }

            } catch (Exception e) {
                // Token is invalid or expired — send 401 Unauthorized
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired JWT token\"}");
                return; // Stop the filter chain — don't proceed to the controller
            }
        }

        // Continue to the next filter / controller
        filterChain.doFilter(request, response);
    }
}
