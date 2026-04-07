package org.app.postsvcwolf.repository;

import org.app.postsvcwolf.Entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository <Vote,String> {
    @Query("SELECT v FROM Vote v WHERE v.userId = :userId " +
            "AND v.targetId = :targetId AND v.targetType = :targetType")
    Optional<Vote> findByUserAndTarget(@Param("userId") String userId,
                                       @Param("targetId") String targetId,
                                       @Param("targetType") Vote.TargetType targetType);

    @Query("SELECT v FROM Vote v WHERE v.userId = :userId AND v.targetId IN :targetIds")
    List<Vote> findByUserAndTargets(@Param("userId") String userId,
                                    @Param("targetIds") List<String> targetIds);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.targetId = :targetId " +
            "AND v.targetType = :targetType AND v.voteType = :voteType")
    Long countByTargetAndType(@Param("targetId") String targetId,
                              @Param("targetType") Vote.TargetType targetType,
                              @Param("voteType") Vote.VoteType voteType);

    @Modifying
    @Query("DELETE FROM Vote v WHERE v.userId = :userId " +
            "AND v.targetId = :targetId AND v.targetType = :targetType")
    void deleteByUserAndTarget(@Param("userId") String userId,
                               @Param("targetId") String targetId,
                               @Param("targetType") Vote.TargetType targetType);
}
