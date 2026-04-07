package org.app.postsvcwolf.repository;

import org.app.postsvcwolf.Entity.Media;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaRepository extends MongoRepository<Media,String> {

    Optional<Media>findByPostId(String postId);

    List<Media> findByUserId(String userId);

    List<Media>findByProcessingStatus(Media.ProcessingStatus status);

    Void deleteByPostId(String postId);

}
