package com.cybershield.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "analysis_executions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "execution_id", nullable = false, unique = true, length = 64)
    private String executionId;

    @Column(name = "algorithm_id", nullable = false, length = 64)
    private String algorithmId;

    @Column(nullable = false, length = 32)
    private String module;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(name = "input_summary", columnDefinition = "TEXT")
    private String inputSummary;

    @Column(name = "execution_time_nanos", nullable = false)
    @Builder.Default
    private Long executionTimeNanos = 0L;

    @Column(name = "comparison_count", nullable = false)
    @Builder.Default
    private Long comparisonCount = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
