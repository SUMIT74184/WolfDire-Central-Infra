package com.app.socialconnection.Dto;

import com.app.socialconnection.Entity.Connection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ConnectionDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConnectionRequest {
        private Long targetUserId;
        private Connection.ConnectionType type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConnectionResponse {
        private Long id;
        private Long userId;
        private Long followerId;
        private Connection.ConnectionStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime acceptedAt;
        private UserInfo userInfo;
        private UserInfo followerInfo;

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FollowCommunityRequest {
        private Long communityId;
        private boolean enabledNotifications;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConnectionStats {
        private long followersCount;
        private long followingCount;
        private long connectionsCount;
        private long pendingRequestsCount;
        private long communitiesFollowed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String displayName;
        private String avatarUrl;
        private boolean verified;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommunityInfo {
        private Long id;
        private String name;
        private String description;
        private String iconUrl;
        private long memberCount;
        private boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConnectionActionRequest {
        private Long connectionId;
        private String action;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockedUserResponse {
        private Long id;
        private Long blockerId;
        private Long blockedId;
        private String reason;
        private LocalDateTime blockedAt;
    }

}
