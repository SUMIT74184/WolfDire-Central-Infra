package org.example.auth.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 🎓 DEBUG TOOL: Request Logging Filter
 * Logs every request to help debug 401/403 errors.
 */
@Component
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String uri = request.getRequestURI();
        String method = request.getMethod();
        
        log.info(">>> AUTH-SERVICE REQUEST: {} {} (ServletPath: {})", method, uri, request.getServletPath());
        
        filterChain.doFilter(request, response);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int status = response.getStatus();
        
        log.info("<<< AUTH-SERVICE RESPONSE: {} {} -> STATUS {} (Auth: {})", 
                method, uri, status, (auth != null ? auth.getName() : "null"));
    }
}
