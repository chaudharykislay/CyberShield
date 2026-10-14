package com.cybershield.service;

import com.cybershield.algorithms.suffix.LcpKasaiAlgorithm;
import com.cybershield.algorithms.suffix.SaisAlgorithm;
import com.cybershield.algorithms.suffix.SuffixArrayAlgorithm;
import com.cybershield.algorithms.suffix.SuffixAutomatonAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class SuffixAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final SuffixArrayAlgorithm suffixArrayAlgorithm = new SuffixArrayAlgorithm();
    private final SaisAlgorithm saisAlgorithm = new SaisAlgorithm();
    private final LcpKasaiAlgorithm lcpKasaiAlgorithm = new LcpKasaiAlgorithm();
    private final SuffixAutomatonAlgorithm suffixAutomatonAlgorithm = new SuffixAutomatonAlgorithm();

    public SuffixAlgorithmService(AnalysisExecutionRepository executionRepository) {
        this.executionRepository = executionRepository;
    }

    public AlgorithmResponse<SuffixArrayAlgorithm.SuffixArrayResult> executeSuffixArray(SuffixArrayRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        SuffixArrayAlgorithm.SuffixArrayResult result = suffixArrayAlgorithm.buildAndSearch(request.getText(), request.getQuery());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "suffix-array", "M2", "SUCCESS",
                String.format("Text len: %d, query: '%s'", request.getText().length(), request.getQuery()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<SuffixArrayAlgorithm.SuffixArrayResult> response = AlgorithmResponse.success("suffix-array", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<SaisAlgorithm.SaisResult> executeSais(SaisRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        SaisAlgorithm.SaisResult result = saisAlgorithm.compute(request.getText());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "sa-is", "M2", "SUCCESS",
                String.format("Text len: %d", request.getText().length()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<SaisAlgorithm.SaisResult> response = AlgorithmResponse.success("sa-is", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<LcpKasaiAlgorithm.LcpResult> executeLcpKasai(LcpKasaiRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        int[] sa = request.getSuffixArray();
        if (sa == null || sa.length != request.getText().length()) {
            sa = saisAlgorithm.compute(request.getText()).getSuffixArray();
        }

        LcpKasaiAlgorithm.LcpResult result = lcpKasaiAlgorithm.compute(request.getText(), sa);
        result.setSuffixArray(sa);
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "lcp-kasai", "M2", "SUCCESS",
                String.format("Text len: %d", request.getText().length()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<LcpKasaiAlgorithm.LcpResult> response = AlgorithmResponse.success("lcp-kasai", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<SuffixAutomatonAlgorithm.AutomatonResult> executeSuffixAutomaton(SuffixAutomatonRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        SuffixAutomatonAlgorithm.AutomatonResult result = suffixAutomatonAlgorithm.buildAndQuery(request.getText(), request.getQuery());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getText().length())
                .build();

        recordExecution(executionId, "suffix-automaton", "M2", "SUCCESS",
                String.format("Text len: %d, query: '%s'", request.getText().length(), request.getQuery()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<SuffixAutomatonAlgorithm.AutomatonResult> response = AlgorithmResponse.success("suffix-automaton", result, metrics, result.getTrace());
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
}
