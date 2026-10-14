package com.cybershield.controller;

import com.cybershield.dto.BenchmarkRequest;
import com.cybershield.dto.BenchmarkResultDto;
import com.cybershield.service.BenchmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@Tag(name = "Algorithm Benchmarking", description = "Performance profiling with JVM warmup and statistical variance measurement")
public class BenchmarkController {

    private final BenchmarkService benchmarkService;

    public BenchmarkController(BenchmarkService benchmarkService) {
        this.benchmarkService = benchmarkService;
    }

    @Operation(summary = "Benchmark Algorithm or Module Suite", description = "Executes algorithms N times with JVM warmup and computes median, min, max, and stdDev times")
    @PostMapping("/api/v1/algorithms/benchmark")
    public ResponseEntity<Object> runBenchmark(@RequestBody(required = false) BenchmarkRequest request) {
        BenchmarkRequest req = request != null ? request : BenchmarkRequest.builder().module("M1").build();
        if (req.getModule() != null && !req.getModule().isBlank()) {
            return ResponseEntity.ok(benchmarkService.runModuleBenchmark(req));
        } else if (req.getAlgorithmId() != null && !req.getAlgorithmId().isBlank()) {
            return ResponseEntity.ok(List.of(benchmarkService.runBenchmark(req)));
        } else {
            return ResponseEntity.ok(benchmarkService.runModuleBenchmark(req));
        }
    }

    @Operation(summary = "Get Stored Benchmark Telemetry", description = "Retrieves recent stored empirical benchmark results")
    @GetMapping({"/api/v1/benchmarks", "/api/v1/algorithms/benchmark"})
    public ResponseEntity<List<BenchmarkResultDto>> getBenchmarks() {
        return ResponseEntity.ok(benchmarkService.runModuleBenchmark(BenchmarkRequest.builder().module("M1").build()));
    }
}
