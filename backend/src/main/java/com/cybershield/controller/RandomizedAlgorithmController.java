package com.cybershield.controller;

import com.cybershield.algorithms.randomized.*;
import com.cybershield.dto.*;
import com.cybershield.service.RandomizedAlgorithmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/algorithms")
@RequiredArgsConstructor
@Tag(name = "M6 Randomized & Parallel Algorithms", description = "Miller-Rabin primality, Randomized QuickSort, Reservoir Sampling, Blelloch Parallel Scan, Brent's Theorem, Monte Carlo & Las Vegas paradigms")
public class RandomizedAlgorithmController {

    private final RandomizedAlgorithmService randomizedAlgorithmService;

    @Operation(summary = "Miller-Rabin Primality Testing", description = "Probabilistic primality test with configurable random witness rounds and BigInteger arithmetic")
    @PostMapping("/miller-rabin")
    public ResponseEntity<AlgorithmResponse<MillerRabinAlgorithm.MillerRabinResult>> executeMillerRabin(@Valid @RequestBody MillerRabinRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeMillerRabin(request));
    }

    @Operation(summary = "Randomized QuickSort", description = "Las Vegas sorting algorithm with uniform random pivot selection and recursion partition tracking")
    @PostMapping("/randomized-quicksort")
    public ResponseEntity<AlgorithmResponse<RandomizedQuickSortAlgorithm.RandomizedSortResult>> executeRandomizedQuickSort(@Valid @RequestBody RandomizedSortRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeRandomizedQuickSort(request));
    }

    @Operation(summary = "Reservoir Sampling (Algorithm R)", description = "Online streaming algorithm generating uniform random sample of size k from unbounded stream")
    @PostMapping("/reservoir-sampling")
    public ResponseEntity<AlgorithmResponse<ReservoirSamplingAlgorithm.ReservoirResult>> executeReservoirSampling(@Valid @RequestBody ReservoirSamplingRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeReservoirSampling(request));
    }

    @Operation(summary = "Parallel Blelloch Scan", description = "Exclusive prefix scan visualization demonstrating O(n) work and O(log n) span tree reduction")
    @PostMapping("/parallel-scan")
    public ResponseEntity<AlgorithmResponse<ParallelScanAlgorithm.ParallelScanResult>> executeParallelScan(@Valid @RequestBody ParallelScanRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeParallelScan(request));
    }

    @Operation(summary = "Brent's Theorem Scheduling Calculator", description = "Theoretical parallel speedup and efficiency calculation using Brent's work-time bound")
    @PostMapping("/brents-theorem")
    public ResponseEntity<AlgorithmResponse<BrentsTheoremCalculator.BrentsResult>> executeBrentsTheorem(@Valid @RequestBody BrentsTheoremRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeBrentsTheorem(request));
    }

    @Operation(summary = "Monte Carlo Paradigm Demo", description = "Estimates Pi using randomized geometric sampling (deterministic time, probabilistic accuracy)")
    @PostMapping("/monte-carlo-demo")
    public ResponseEntity<AlgorithmResponse<MonteCarloExample.MonteCarloResult>> executeMonteCarlo(@Valid @RequestBody MonteCarloRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeMonteCarlo(request));
    }

    @Operation(summary = "Las Vegas Paradigm Demo", description = "Executes randomized quicksort with deterministic correctness and probabilistic runtime")
    @PostMapping("/las-vegas-demo")
    public ResponseEntity<AlgorithmResponse<LasVegasExample.LasVegasResult>> executeLasVegas(@RequestBody LasVegasRequest request) {
        return ResponseEntity.ok(randomizedAlgorithmService.executeLasVegas(request));
    }
}
