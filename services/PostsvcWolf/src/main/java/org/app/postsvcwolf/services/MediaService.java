package org.app.postsvcwolf.services;

import com.amazonaws.services.s3.AmazonS3;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.app.postsvcwolf.Entity.Media;
import org.app.postsvcwolf.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    private final MediaRepository mediaRepository;
    private final AmazonS3 s3Client; // Works perfectly with Cloudflare R2

    @Value("${cloudflare.r2.bucket-name}")
    private String bucketName;

    @Value("${cloudflare.r2.public-url}")
    private String r2PublicUrl;

    public String uploadMedia(MultipartFile file, String postId, String userId) {
        try {
            String fileName = generateFileName(file.getOriginalFilename());
            String s3Key = "posts/" + postId + "/" + fileName;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            PutObjectRequest request = new PutObjectRequest(
                    bucketName,
                    s3Key,
                    file.getInputStream(),
                    metadata
            );

            // Uploads to R2 using the S3 protocol
            s3Client.putObject(request);

            // Generate the R2 public URL manually (AWS's getUrl won't work here)
            String mediaUrl = r2PublicUrl + "/" + s3Key;

            Media.MediaType mediaType = determineMediaType(file.getContentType());

            Media media = Media.builder()
                    .postId(postId)
                    .userId(userId)
                    .fileName(fileName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .s3Key(s3Key)
                    .s3Url(mediaUrl)
                    .mediaType(mediaType)
                    .processingStatus(Media.ProcessingStatus.COMPLETED)
                    .uploadedAt(LocalDateTime.now())
                    .processedAt(LocalDateTime.now())
                    .build();

            mediaRepository.save(media);

            log.info("Uploaded media for post: {}, URL: {}", postId, mediaUrl);

            return mediaUrl;

        } catch (IOException e) {
            log.error("Failed to upload media to R2", e);
            throw new RuntimeException("Failed to upload media: " + e.getMessage());
        }
    }

    private String generateFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    private Media.MediaType determineMediaType(String contentType) {
        if (contentType == null) {
            return Media.MediaType.IMAGE;
        }

        if (contentType.startsWith("image/")) {
            if (contentType.contains("gif")) {
                return Media.MediaType.GIF;
            }
            return Media.MediaType.IMAGE;
        } else if (contentType.startsWith("video/")) {
            return Media.MediaType.VIDEO;
        }

        return Media.MediaType.IMAGE;
    }
}
