package com.app.socialconnection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 🎓 LEARNING: Main Application Class
 *
 * @SpringBootApplication  — Combines @Configuration + @EnableAutoConfiguration + @ComponentScan
 * @EnableDiscoveryClient  — Registers this service with Eureka (service discovery)
 * @EnableFeignClients     — Enables the @FeignClient interfaces we defined (like UserServiceClient)
 *
 * When this app starts, it:
 * 1. Scans all packages under com.app.socialconnection for @Component/@Service/@Controller etc.
 * 2. Auto-configures Spring Data JPA, Redis, Kafka based on application.properties
 * 3. Registers itself with Eureka so other services can find it
 * 4. Creates Feign client proxies for inter-service communication
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class SocialConnectionApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialConnectionApplication.class, args);
    }
}
