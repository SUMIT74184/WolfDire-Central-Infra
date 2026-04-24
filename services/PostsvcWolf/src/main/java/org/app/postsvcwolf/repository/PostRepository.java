package org.app.postsvcwolf.repository;



import org.app.postsvcwolf.Entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post,String> {

    @Query("SELECT p FROM Post p WHERE p.communityId = :communityId " +
            "AND p.isRemoved = false AND p.isSpam = false " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByCommunity(@Param("communityId") String communityId, Pageable pageable);


    //finding the users
    @Query("SELECT p FROM Post p WHERE p.userId = :userId " +
            "AND p.isRemoved = false ORDER BY p.createdAt DESC")
    Page<Post> findByUser(@Param("userId") String userId, Pageable pageable);


    //Finding for the trending topics
    @Query("SELECT p FROM Post p WHERE p.isRemoved = false AND p.isSpam = false " +
            "AND p.createdAt >= :since ORDER BY p.score DESC, p.createdAt DESC")
    Page<Post> findTrending(@Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.communityId = :communityId " +
            "AND p.isRemoved = false AND p.isSpam = false " +
            "ORDER BY p.score DESC, p.createdAt DESC")
    Page<Post> findHot(@Param("communityId") String communityId, Pageable pageable);



    // Search ...later will move towards the elastic search
    @Query("SELECT p FROM Post p WHERE " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND p.isRemoved = false AND p.isSpam = false")
    Page<Post> search(@Param("query") String query, Pageable pageable);



    @Query("SELECT p FROM Post p WHERE p.id = :id AND p.isRemoved = false")
    Optional<Post> findActive(@Param("id") String id);


    @Modifying
    @Query("UPDATE Post p SET p.upVotes = p.upVotes + 1, p.score = p.score + 1 WHERE p.id = :postId")
    void incrementUpvotes(@Param("postId") String postId);



    @Modifying
    @Query("UPDATE Post p SET p.downVotes = p.downVotes + 1, p.score = p.score - 1 WHERE p.id = :postId")
    void incrementDownvotes(@Param("postId") String postId);


    @Modifying
    @Query("UPDATE Post p SET p.upVotes = p.upVotes - 1, p.score = p.score - 1 WHERE p.id = :postId")
    void decrementUpvotes(@Param("postId") String postId);

    @Modifying
    @Query("UPDATE Post p SET p.downVotes = p.downVotes - 1, p.score = p.score + 1 WHERE p.id = :postId")
    void decrementDownvotes(@Param("postId") String postId);


    @Modifying
    @Query("UPDATE Post p SET p.commentCount = p.commentCount + 1 WHERE p.id = :postId")
    void incrementCommentCount(@Param("postId") String postId);


    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :postId")
    void incrementViewCount(@Param("postId") String postId);


    @Modifying
    @Query("UPDATE Post p SET p.shareCount = p.shareCount + 1 WHERE p.id = :postId")
    void incrementShareCount(@Param("postId") String postId);



    List<Post> findByOriginalPostId(String originalPostId);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.userId = :userId AND p.createdAt >= :since")
    Long countUserPostsSince(@Param("userId") String userId, @Param("since") LocalDateTime since);

}
