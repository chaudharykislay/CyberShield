package com.cybershield.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "benchmark_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchmarkResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "algorithm_id", nullable = false, length = 64)
    private String algorithmId;

    @Column(name = "input_size", nullable = false)
    private Long inputSize;

    @Column(name = "execution_time_nanos", nullable = false)
    private Long executionTimeNanos;

    @Column(name = "comparison_count", nullable = false)
    @Builder.Default
    private Long comparisonCount = 0L;

    @Column(name = "warmup_rounds", nullable = false)
    private Integer warmupRounds;

    @Column(name = "trial_rounds", nullable = false)
    private Integer trialRounds;

    @Column(nullable = false, length = 64)
    private String methodology;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
