package com.app.socialconnection.exception;

/**
 * 🎓 LEARNING: Custom Exception
 *
 * This is thrown when we look for something (a connection, a user, etc.)
 * and it doesn't exist. The GlobalExceptionHandler catches it and returns
 * a 404 HTTP response instead of a 500 server error.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}
