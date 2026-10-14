package com.cybershield.service;

import com.cybershield.algorithms.strings.AhoCorasickAlgorithm;
import com.cybershield.algorithms.strings.KmpAlgorithm;
import com.cybershield.algorithms.strings.RabinKarpAlgorithm;
import com.cybershield.algorithms.strings.ZFunctionAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.model.AnalysisFinding;
import com.cybershield.repository.AnalysisExecutionRepository;
import com.cybershield.repository.AnalysisFindingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class StringAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final AnalysisFindingRepository findingRepository;

    private final KmpAlgorithm kmpAlgorithm = new KmpAlgorithm();
    private final ZFunctionAlgorithm zFunctionAlgorithm = new ZFunctionAlgorithm();
    private final RabinKarpAlgorithm rabinKarpAlgorithm = new RabinKarpAlgorithm();
    private final AhoCorasickAlgorithm ahoCorasickAlgorithm = new AhoCorasickAlgorithm();

    public StringAlgorithmService(AnalysisExecutionRepository executionRepository,
                                  AnalysisFindingRepository findingRepository) {
        this.executionRepository = executionRepository;
        this.findingRepository = findingRepository;
    }

    public AlgorithmResponse<KmpAlgorithm.KmpResult> executeKmp(KmpRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        KmpAlgorithm.KmpResult result = kmpAlgorithm.search(request.getText(), request.getPattern());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "kmp", "M1", "SUCCESS",
                String.format("Text len: %d, pattern: '%s'", request.getText().length(), request.getPattern()),
                elapsedNanos, result.getComparisonCount());

        if (!result.getMatchPositions().isEmpty()) {
            saveFinding(executionId, "PATTERN_MATCH",
                    String.format("KMP detected %d occurrence(s) of pattern '%s'", result.getMatchPositions().size(), request.getPattern()),
                    "HIGH", "Matches at offsets: " + result.getMatchPositions());
        }

        AlgorithmResponse<KmpAlgorithm.KmpResult> response = AlgorithmResponse.success("kmp", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<ZFunctionAlgorithm.ZFunctionResult> executeZFunction(ZFunctionRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        ZFunctionAlgorithm.ZFunctionResult result = zFunctionAlgorithm.search(request.getText(), request.getPattern());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "z-function", "M1", "SUCCESS",
                String.format("Text len: %d, pattern: '%s'", request.getText().length(), request.getPattern()),
                elapsedNanos, result.getComparisonCount());

        if (!result.getMatchPositions().isEmpty()) {
            saveFinding(executionId, "PATTERN_MATCH",
                    String.format("Z-Algorithm detected %d occurrence(s) of pattern '%s'", result.getMatchPositions().size(), request.getPattern()),
                    "HIGH", "Matches at offsets: " + result.getMatchPositions());
        }

        AlgorithmResponse<ZFunctionAlgorithm.ZFunctionResult> response = AlgorithmResponse.success("z-function", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<RabinKarpAlgorithm.RabinKarpResult> executeRabinKarp(RabinKarpRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        RabinKarpAlgorithm.RabinKarpResult result = rabinKarpAlgorithm.search(request.getText(), request.getPattern());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "rabin-karp", "M1", "SUCCESS",
                String.format("Text len: %d, pattern: '%s'", request.getText().length(), request.getPattern()),
                elapsedNanos, result.getComparisonCount());

        if (!result.getMatchPositions().isEmpty()) {
            saveFinding(executionId, "HASH_PATTERN_MATCH",
                    String.format("Rabin-Karp matched %d occurrence(s) with %d spurious collisions", result.getMatchPositions().size(), result.getSpuriousHits()),
                    "HIGH", "Matches at offsets: " + result.getMatchPositions());
        }

        AlgorithmResponse<RabinKarpAlgorithm.RabinKarpResult> response = AlgorithmResponse.success("rabin-karp", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<AhoCorasickAlgorithm.AhoCorasickResult> executeAhoCorasick(AhoCorasickRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        AhoCorasickAlgorithm.AhoCorasickResult result = ahoCorasickAlgorithm.search(request.getText(), request.getPatterns());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "aho-corasick", "M1", "SUCCESS",
                String.format("Text len: %d, pattern count: %d", request.getText().length(), request.getPatterns().size()),
                elapsedNanos, result.getComparisonCount());

        if (!result.getMatches().isEmpty()) {
            saveFinding(executionId, "MULTI_PATTERN_MATCH",
                    String.format("Aho-Corasick dictionary search matched %d signature instance(s)", result.getMatches().size()),
                    "CRITICAL", "Matched patterns: " + result.getMatches().stream().map(AhoCorasickAlgorithm.AhoCorasickMatch::getPattern).distinct().toList());
        }

        AlgorithmResponse<AhoCorasickAlgorithm.AhoCorasickResult> response = AlgorithmResponse.success("aho-corasick", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    private void recordExecution(String executionId, String algoId, String module, String status, String summary, long timeNanos, long comparisons) {
        try {
            AnalysisExecution exec = AnalysisExecution.builder()
                    .executionId(executionId)
                    .algorithmId(algoId)
                    .module(module)
                    .status(status)
                    .inputSummary(summary)
                    .executionTimeNanos(timeNanos)
                    .comparisonCount(comparisons)
                    .completedAt(Instant.now())
                    .build();
            executionRepository.save(exec);
        } catch (Exception ex) {
            log.warn("Failed to persist analysis execution: {}", ex.getMessage());
        }
    }

    private void saveFinding(String executionId, String findingType, String description, String severity, String evidence) {
        try {
            AnalysisFinding finding = AnalysisFinding.builder()
                    .executionId(executionId)
                    .findingType(findingType)
                    .description(description)
                    .severity(severity)
                    .evidence(evidence)
                    .build();
            findingRepository.save(finding);
        } catch (Exception ex) {
            log.warn("Failed to persist analysis finding: {}", ex.getMessage());
        }
    }
}
