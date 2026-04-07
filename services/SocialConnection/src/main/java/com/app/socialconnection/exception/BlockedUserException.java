package com.app.socialconnection.exception;

/**
 * Thrown when a user tries to interact with someone who has blocked them
 * (or whom they have blocked). Maps to HTTP 403 Forbidden.
 */
public class BlockedUserException extends RuntimeException {

    public BlockedUserException(String message) {
        super(message);
    }
}
