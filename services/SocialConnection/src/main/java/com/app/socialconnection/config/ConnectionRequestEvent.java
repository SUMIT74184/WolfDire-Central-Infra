package com.app.socialconnection.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 🎓 LEARNING: Kafka Event DTO
 *
 * This class represents the "message" that gets published to Kafka.
 * When a connection request is sent/accepted/rejected, we publish this event
 * so other microservices (like Notification Service) can react to it.
 *
 * This is the "event-driven architecture" pattern:
 * - This service PUBLISHES events (doesn't care who listens)
 * - Other services SUBSCRIBE and react (e.g., send push notification)
 * - Services are decoupled — they communicate through events, not direct calls
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequestEvent {

    private Long senderId;
    private Long receiverId;
    private String senderUsername;
    private String receiverUsername;
    private String type;       // FOLLOW or CONNECTION
    private String status;     // PENDING, ACCEPTED, REJECTED, BLOCKED
    private LocalDateTime timestamp;
}
