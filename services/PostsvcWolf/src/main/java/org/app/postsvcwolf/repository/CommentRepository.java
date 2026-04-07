package org.app.postsvcwolf.repository;


import io.lettuce.core.dynamic.annotation.Param;
import org.app.postsvcwolf.Entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query("SELECT c FROM Comment c WHERE c.postId = :postId " +
            "AND c.parentCommentId IS NULL " +
            "AND c.isDeleted = false AND c.isRemoved = false")
    Page<Comment> findTopLevel(@Param("PostId") String postId, Pageable pageable);


    @Query("SELECT c FROM Comment c WHERE c.postId = :postId " +
            "AND c.parentCommentId IS NULL " +
            "AND c.isDeleted = false AND c.isRemoved = false " +
            "ORDER BY c.score DESC, c.createdAt DESC")
    List<Comment> findTopLevelSorted(@Param("postId") String postId);


    @Query("SELECT c FROM Comment c WHERE c.parentCommentId = :parentId " +
            "AND c.isDeleted = false AND c.isRemoved = false " +
            "ORDER BY c.score DESC, c.createdAt DESC")
    List<Comment> findReplies(@Param("parentId") String parentId);

    @Query("SELECT c FROM Comment c WHERE c.userId = :userId " +
            "AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Comment> findByUser(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.id = :id AND c.isDeleted = false")
    Optional<Comment> findActive(@Param("id") String id);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.postId = :postId AND c.isDeleted = false")
    Long countByPost(@Param("postId") String postId);

    @Modifying
    @Query("UPDATE Comment c SET c.upvotes = c.upvotes + 1, c.score = c.score + 1 WHERE c.id = :commentId")
    void incrementUpvotes(@Param("commentId") String commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.downvotes = c.downvotes + 1, c.score = c.score - 1 WHERE c.id = :commentId")
    void incrementDownvotes(@Param("commentId") String commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.upvotes = c.upvotes - 1, c.score = c.score - 1 WHERE c.id = :commentId")
    void decrementUpvotes(@Param("commentId") String commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.downvotes = c.downvotes - 1, c.score = c.score + 1 WHERE c.id = :commentId")
    void decrementDownvotes(@Param("commentId") String commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.replyCount = c.replyCount + 1 WHERE c.id = :commentId")
    void incrementReplyCount(@Param("commentId") String commentId);





}
