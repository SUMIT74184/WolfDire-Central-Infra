package com.app.socialconnection.client;

import com.app.socialconnection.Dto.ConnectionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * 🎓 LEARNING: Feign Client
 *
 * OpenFeign lets you call other microservices using a simple interface —
 * no RestTemplate, no WebClient, no manual HTTP code.
 *
 * How it works:
 * 1. You declare an interface with @FeignClient(name = "service-name")
 * 2. The "name" must match the service name registered in Eureka
 * 3. You write method signatures that look like controller endpoints
 * 4. Spring auto-generates the HTTP client at runtime
 * 5. Eureka handles service discovery (finds the IP/port for "user-service")
 *
 * So calling userServiceClient.getUserById(42L) actually makes:
 *   GET http://<user-service-ip>:<port>/api/users/42
 */
@FeignClient(name = "user-service", path = "/api/users")
public interface UserServiceClient {

    @GetMapping("/{userId}")
    ConnectionDTO.UserInfo getUserById(@PathVariable("userId") Long userId);
}
