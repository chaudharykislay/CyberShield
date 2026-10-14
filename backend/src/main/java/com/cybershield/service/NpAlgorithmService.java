package com.cybershield.service;

import com.cybershield.algorithms.np.ReductionAlgorithm;
import com.cybershield.algorithms.np.SatSolverAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class NpAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final SatSolverAlgorithm satSolverAlgorithm = new SatSolverAlgorithm();
    private final ReductionAlgorithm reductionAlgorithm = new ReductionAlgorithm();

    public NpAlgorithmService(AnalysisExecutionRepository executionRepository) {
        this.executionRepository = executionRepository;
    }

    public AlgorithmResponse<SatSolverAlgorithm.SatResult> executeSat(SatRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        SatSolverAlgorithm.SatResult result = satSolverAlgorithm.solve(request.getNumVariables(), request.getClauses());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) (request.getNumVariables() + (request.getClauses() != null ? request.getClauses().size() : 0)))
                .build();

        recordExecution(executionId, "sat-solver", "M5", "SUCCESS",
                String.format("Vars: %d, clauses: %d, sat: %b", request.getNumVariables(),
                        request.getClauses() != null ? request.getClauses().size() : 0, result.isSatisfiable()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<SatSolverAlgorithm.SatResult> response =
                AlgorithmResponse.success("sat-solver", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<Object> executeReduction(ReductionRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        Object result;
        java.util.List<String> trace;
        String type = request.getType() != null ? request.getType().toUpperCase() : "SAT_TO_CLIQUE";

        if ("CLIQUE_TO_IS".equals(type)) {
            int vCount = request.getVertexCount() != null ? request.getVertexCount() : 0;
            int k = request.getK() != null ? request.getK() : 0;
            ReductionAlgorithm.IndependentSetReductionResult r =
                    reductionAlgorithm.reduceCliqueToIndependentSet(vCount, request.getEdges(), k);
            result = r;
            trace = r.getTrace();
        } else if ("IS_TO_VC".equals(type)) {
            int vCount = request.getVertexCount() != null ? request.getVertexCount() : 0;
            ReductionAlgorithm.VertexCoverReductionResult r =
                    reductionAlgorithm.reduceIndependentSetToVertexCover(vCount, request.getEdges(), request.getIndependentSet());
            result = r;
            trace = r.getTrace();
        } else {
            ReductionAlgorithm.CliqueReductionResult r =
                    reductionAlgorithm.reduce3SatToClique(request.getClauses());
            result = r;
            trace = r.getTrace();
        }

        long elapsedNanos = System.nanoTime() - startNanos;
        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(0L)
                .inputSize(0L)
                .build();

        recordExecution(executionId, "reduction-" + type.toLowerCase(), "M5", "SUCCESS",
                "Reduction type: " + type, elapsedNanos, 0L);

        AlgorithmResponse<Object> response = AlgorithmResponse.success("reduction", result, metrics, trace);
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<ReductionAlgorithm.VertexCoverApproxResult> executeVertexCover(VertexCoverRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        ReductionAlgorithm.VertexCoverApproxResult result =
                reductionAlgorithm.approximateVertexCover2(request.getVertexCount(), request.getEdges());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount((long) request.getEdges().size())
                .inputSize((long) request.getVertexCount())
                .build();

        recordExecution(executionId, "vertex-cover-approx", "M5", "SUCCESS",
                String.format("Vertices: %d, edges: %d, VC size: %d",
                        request.getVertexCount(), request.getEdges().size(), result.getVertexCoverSize()),
                elapsedNanos, request.getEdges().size());

        AlgorithmResponse<ReductionAlgorithm.VertexCoverApproxResult> response =
                AlgorithmResponse.success("vertex-cover", result, metrics, result.getTrace());
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
