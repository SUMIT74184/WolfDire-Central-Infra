package org.app.postsvcwolf.repository;

import org.app.postsvcwolf.Entity.SavedPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    
    Optional<SavedPost> findByUserIdAndPostId(String userId, String postId);
    
    boolean existsByUserIdAndPostId(String userId, String postId);

    Page<SavedPost> findByUserIdOrderBySavedAtDesc(String userId, Pageable pageable);
}
