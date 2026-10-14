package com.cybershield.service;

import com.cybershield.algorithms.randomized.*;
import com.cybershield.dto.*;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class RandomizedAlgorithmService {

    private final AnalysisExecutionRepository executionRepository;
    private final MillerRabinAlgorithm millerRabinAlgorithm = new MillerRabinAlgorithm();
    private final RandomizedQuickSortAlgorithm randomizedQuickSortAlgorithm = new RandomizedQuickSortAlgorithm();
    private final ReservoirSamplingAlgorithm reservoirSamplingAlgorithm = new ReservoirSamplingAlgorithm();
    private final ParallelScanAlgorithm parallelScanAlgorithm = new ParallelScanAlgorithm();
    private final BrentsTheoremCalculator brentsTheoremCalculator = new BrentsTheoremCalculator();
    private final MonteCarloExample monteCarloExample = new MonteCarloExample();
    private final LasVegasExample lasVegasExample = new LasVegasExample();

    public RandomizedAlgorithmService(AnalysisExecutionRepository executionRepository) {
        this.executionRepository = executionRepository;
    }

    public AlgorithmResponse<MillerRabinAlgorithm.MillerRabinResult> executeMillerRabin(MillerRabinRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        MillerRabinAlgorithm.MillerRabinResult result =
                millerRabinAlgorithm.testPrimality(request.getNumber(), request.getRounds(), request.getSeed());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize(request.getNumber())
                .build();

        recordExecution(executionId, "miller-rabin", "M6", "SUCCESS",
                String.format("Number: %d, rounds: %d, prime: %b", request.getNumber(), request.getRounds(), result.isProbablePrime()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<MillerRabinAlgorithm.MillerRabinResult> response =
                AlgorithmResponse.success("miller-rabin", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<RandomizedQuickSortAlgorithm.RandomizedSortResult> executeRandomizedQuickSort(RandomizedSortRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        RandomizedQuickSortAlgorithm.RandomizedSortResult result =
                randomizedQuickSortAlgorithm.sort(request.getArray(), request.getSeed());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getTotalComparisons())
                .inputSize((long) request.getArray().size())
                .build();

        recordExecution(executionId, "randomized-quicksort", "M6", "SUCCESS",
                String.format("Array size: %d, comparisons: %d", request.getArray().size(), result.getTotalComparisons()),
                elapsedNanos, result.getTotalComparisons());

        AlgorithmResponse<RandomizedQuickSortAlgorithm.RandomizedSortResult> response =
                AlgorithmResponse.success("randomized-quicksort", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<ReservoirSamplingAlgorithm.ReservoirResult> executeReservoirSampling(ReservoirSamplingRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        ReservoirSamplingAlgorithm.ReservoirResult result =
                reservoirSamplingAlgorithm.sample(request.getStream(), request.getReservoirSize(), request.getSeed());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getStream().size())
                .build();

        recordExecution(executionId, "reservoir-sampling", "M6", "SUCCESS",
                String.format("Stream: %d, sample size: %d", request.getStream().size(), request.getReservoirSize()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<ReservoirSamplingAlgorithm.ReservoirResult> response =
                AlgorithmResponse.success("reservoir-sampling", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<ParallelScanAlgorithm.ParallelScanResult> executeParallelScan(ParallelScanRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        ParallelScanAlgorithm.ParallelScanResult result =
                parallelScanAlgorithm.scan(request.getArray(), request.getOperation());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisonCount())
                .inputSize((long) request.getArray().size())
                .build();

        recordExecution(executionId, "parallel-scan", "M6", "SUCCESS",
                String.format("Array: %d, op: %s, depth: %d", request.getArray().size(), request.getOperation(), result.getParallelDepth()),
                elapsedNanos, result.getComparisonCount());

        AlgorithmResponse<ParallelScanAlgorithm.ParallelScanResult> response =
                AlgorithmResponse.success("parallel-scan", result, metrics, result.getTrace());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<BrentsTheoremCalculator.BrentsResult> executeBrentsTheorem(BrentsTheoremRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        BrentsTheoremCalculator.BrentsResult result =
                brentsTheoremCalculator.calculate(request.getTotalWork(), request.getCriticalPathDepth(), request.getProcessorCount());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(0L)
                .inputSize(request.getTotalWork())
                .build();

        recordExecution(executionId, "brents-theorem", "M6", "SUCCESS",
                String.format("Work: %d, depth: %d, p: %d", request.getTotalWork(), request.getCriticalPathDepth(), request.getProcessorCount()),
                elapsedNanos, 0L);

        AlgorithmResponse<BrentsTheoremCalculator.BrentsResult> response =
                AlgorithmResponse.success("brents-theorem", result, metrics, result.getAnalysis());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<MonteCarloExample.MonteCarloResult> executeMonteCarlo(MonteCarloRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        MonteCarloExample.MonteCarloResult result = monteCarloExample.estimatePi(request.getSamples(), request.getSeed());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount((long) request.getSamples())
                .inputSize((long) request.getSamples())
                .build();

        recordExecution(executionId, "monte-carlo-pi", "M6", "SUCCESS",
                String.format("Samples: %d, Pi est: %.6f", request.getSamples(), result.getEstimatedPi()),
                elapsedNanos, (long) request.getSamples());

        AlgorithmResponse<MonteCarloExample.MonteCarloResult> response =
                AlgorithmResponse.success("monte-carlo-demo", result, metrics, result.getExplanation());
        response.setExecutionId(executionId);
        return response;
    }

    public AlgorithmResponse<LasVegasExample.LasVegasResult> executeLasVegas(LasVegasRequest request) {
        String executionId = UUID.randomUUID().toString();
        long startNanos = System.nanoTime();

        LasVegasExample.LasVegasResult result = lasVegasExample.runQuicksortDemo(request.getInput(), request.getSeed());
        long elapsedNanos = System.nanoTime() - startNanos;

        ExecutionMetrics metrics = ExecutionMetrics.builder()
                .executionTimeNanos(elapsedNanos)
                .comparisonCount(result.getComparisons())
                .inputSize((long) result.getOriginalArray().size())
                .build();

        recordExecution(executionId, "las-vegas-quicksort", "M6", "SUCCESS",
                String.format("Input size: %d, comparisons: %d", result.getOriginalArray().size(), result.getComparisons()),
                elapsedNanos, result.getComparisons());

        AlgorithmResponse<LasVegasExample.LasVegasResult> response =
                AlgorithmResponse.success("las-vegas-demo", result, metrics, result.getExplanation());
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
