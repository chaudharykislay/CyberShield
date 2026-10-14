package com.cybershield.service;

import com.cybershield.algorithms.dp.BitmaskDpAlgorithm;
import com.cybershield.algorithms.dp.EditDistanceAlgorithm;
import com.cybershield.algorithms.dp.MatrixChainAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class DpAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final EditDistanceAlgorithm editDistanceAlgorithm = new EditDistanceAlgorithm();
    private final BitmaskDpAlgorithm bitmaskDpAlgorithm = new BitmaskDpAlgorithm();
    private final MatrixChainAlgorithm matrixChainAlgorithm = new MatrixChainAlgorithm();

    public DpAlgorithmService(AnalysisExecutionRepository executionRepository) {
        this.executionRepository = executionRepository;
    }

    public AlgorithmResponse<EditDistanceAlgorithm.EditDistanceResult> executeEditDistance(EditDistanceRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        EditDistanceAlgorithm.EditDistanceResult result = editDistanceAlgorithm.compute(
                request.getSource(), request.getTarget(), request.getMode(),
                request.getInsertCost(), request.getDeleteCost(), request.getSubstituteCost());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) (request.getSource().length() + request.getTarget().length()))
                .build();

        recordExecution(executionId, "edit-distance", "M3", "SUCCESS",
                String.format("'%s' -> '%s' (mode: %s, dist: %d)", request.getSource(), request.getTarget(), request.getMode(), result.getDistance()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<EditDistanceAlgorithm.EditDistanceResult> response = AlgorithmResponse.success("edit-distance", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<BitmaskDpAlgorithm.BitmaskDpResult> executeBitmaskDp(BitmaskDpRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        BitmaskDpAlgorithm.BitmaskDpResult result = bitmaskDpAlgorithm.solve(request.getNumPolicies(), request.getRules());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getRules().size())
                .build();

        recordExecution(executionId, "bitmask-dp", "M3", "SUCCESS",
                String.format("Policies: %d, rules: %d, minCost: %d", request.getNumPolicies(), request.getRules().size(), result.getMinCost()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<BitmaskDpAlgorithm.BitmaskDpResult> response = AlgorithmResponse.success("bitmask-dp", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<MatrixChainAlgorithm.MatrixChainResult> executeMatrixChain(MatrixChainRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        MatrixChainAlgorithm.MatrixChainResult result = matrixChainAlgorithm.compute(request.getDimensions());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getDimensions().length)
                .build();

        recordExecution(executionId, "matrix-chain", "M3", "SUCCESS",
                String.format("Matrices count: %d, minOps: %d", request.getDimensions().length - 1, result.getMinOperations()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<MatrixChainAlgorithm.MatrixChainResult> response = AlgorithmResponse.success("matrix-chain", result, metrics, result.getTrace());
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
