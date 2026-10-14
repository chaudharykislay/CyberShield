package com.cybershield.service;

import com.cybershield.algorithms.graph.*;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class FlowAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final MaxFlowAlgorithm maxFlowAlgorithm = new MaxFlowAlgorithm();
    private final EdmondsKarpAlgorithm edmondsKarpAlgorithm = new EdmondsKarpAlgorithm();
    private final DinicsAlgorithm dinicsAlgorithm = new DinicsAlgorithm();
    private final BipartiteMatchingAlgorithm bipartiteMatchingAlgorithm = new BipartiteMatchingAlgorithm();
    private final MinCutAlgorithm minCutAlgorithm = new MinCutAlgorithm();

    public FlowAlgorithmService(AnalysisExecutionRepository executionRepository) {
        this.executionRepository = executionRepository;
    }

    public AlgorithmResponse<Object> executeMaxFlow(FlowGraphRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        FlowGraph graph = buildGraph(request);
        String algo = request.getFlowAlgorithm() != null ? request.getFlowAlgorithm().toUpperCase() : "EDMONDS_KARP";

        Object result;
        long comparisons;
        long timeNanos;
        java.util.List<String> trace;

        if ("FORD_FULKERSON".equals(algo)) {
            MaxFlowAlgorithm.MaxFlowResult r = maxFlowAlgorithm.solve(graph, request.getSource(), request.getSink());
            result = r;
            comparisons = r.getComparisonCount();
            trace = r.getTrace();
        } else if ("DINIC".equals(algo)) {
            DinicsAlgorithm.DinicsResult r = dinicsAlgorithm.solve(graph, request.getSource(), request.getSink());
            result = r;
            comparisons = r.getComparisonCount();
            trace = r.getTrace();
        } else {
            EdmondsKarpAlgorithm.EdmondsKarpResult r = edmondsKarpAlgorithm.solve(graph, request.getSource(), request.getSink());
            result = r;
            comparisons = r.getComparisonCount();
            trace = r.getTrace();
        }
        timeNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(timeNanos)
                .comparisonCount(comparisons)
                .inputSize((long) request.getNodes())
                .build();

        recordExecution(executionId, "max-flow-" + algo.toLowerCase(), "M4", "SUCCESS",
                String.format("Nodes: %d, edges: %d, src: %d, sink: %d, algo: %s",
                        request.getNodes(), request.getEdges().size(), request.getSource(), request.getSink(), algo),
                timeNanos, comparisons);

        AlgorithmResponse<Object> response = AlgorithmResponse.success("max-flow", result, metrics, trace);
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<BipartiteMatchingAlgorithm.MatchingResult> executeBipartiteMatching(BipartiteMatchingRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        BipartiteMatchingAlgorithm.MatchingResult result = bipartiteMatchingAlgorithm.match(
                request.getLeftCount(), request.getRightCount(), request.getEdges());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) (request.getLeftCount() + request.getRightCount()))
                .build();

        recordExecution(executionId, "bipartite-matching", "M4", "SUCCESS",
                String.format("Analysts: %d, alerts: %d, matchSize: %d",
                        request.getLeftCount(), request.getRightCount(), result.getMatchingSize()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<BipartiteMatchingAlgorithm.MatchingResult> response =
                AlgorithmResponse.success("bipartite-matching", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<MinCutAlgorithm.MinCutResult> executeMinCut(FlowGraphRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        FlowGraph graph = buildGraph(request);
        MinCutAlgorithm.MinCutResult result = minCutAlgorithm.computeMinCut(graph, request.getSource(), request.getSink());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getNodes())
                .build();

        recordExecution(executionId, "min-cut", "M4", "SUCCESS",
                String.format("Nodes: %d, cutCap: %d, maxFlow: %d",
                        request.getNodes(), result.getCutCapacity(), result.getMaxFlow()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<MinCutAlgorithm.MinCutResult> response =
                AlgorithmResponse.success("min-cut", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    private FlowGraph buildGraph(FlowGraphRequest req) {
        FlowGraph graph = new FlowGraph(req.getNodes());
        if (req.getEdges() != null) {
            for (FlowEdgeDto e : req.getEdges()) {
                graph.addEdge(e.getFrom(), e.getTo(), e.getCapacity());
            }
        }
        return graph;
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
