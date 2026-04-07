package com.app.socialconnection.exception;

/**
 * Thrown when a user tries to create a duplicate resource
 * (e.g., sending a connection request that already exists).
 * Maps to HTTP 409 Conflict.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
