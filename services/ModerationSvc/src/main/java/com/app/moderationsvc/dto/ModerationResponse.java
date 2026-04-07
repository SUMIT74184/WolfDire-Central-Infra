package com.app.moderationsvc.dto;

import com.app.moderationsvc.moderation.ModerationAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResponse {
    private boolean approved;
    private ModerationAction action;
    private Double toxicityScore;
    private Double spamScore;
    private Double hateSpeechScore;
    private Double violenceScore;
    private Double sexualScore;
    private boolean flagged;
    private String reason;
    private Double trustScore;
    private String summary;
    private String sentiment;
}
