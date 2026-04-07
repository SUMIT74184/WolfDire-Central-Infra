package com.app.moderationsvc.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationScores {
    @Builder.Default
    private Double toxicityScore = 0.0;

    @Builder.Default
    private Double hateSpeechScore = 0.0;

    @Builder.Default
    private Double violenceScore = 0.0;

    @Builder.Default
    private Double sexualScore = 0.0;

    @Builder.Default
    private Double spamScore = 0.0;

    @Builder.Default
    private double harassmentScore = 0.0;

    @Builder.Default
    private Double selfHarmScore = 0.0;

    @Builder.Default
    private boolean flagged = false;
}
