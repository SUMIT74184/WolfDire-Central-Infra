package com.app.notificationsvc.services;

import com.app.notificationsvc.entity.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendNotificationEmail(String toEmail, Notification notification) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(notification.getTitle());
            helper.setText(buildEmailBody(notification), true);

            mailSender.send(message);
            log.info("Email sent to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Error sending email to: {}", toEmail, e);
        }
    }

    private String buildEmailBody(Notification notification) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="color: #666; font-size: 16px;">%s</p>
                        <a href="%s" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                            View Notification
                        </a>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        notification.getTitle(),
                        notification.getMessage(),
                        "https://wolfdire.com" + notification.getActionUrl());
    }
}