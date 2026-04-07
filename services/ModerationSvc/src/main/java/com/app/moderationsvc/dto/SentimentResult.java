package com.app.moderationsvc.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResult {
    private String sentiment;
    private Double score;
    private Integer positiveCount;
    private Integer negativeCount;
}