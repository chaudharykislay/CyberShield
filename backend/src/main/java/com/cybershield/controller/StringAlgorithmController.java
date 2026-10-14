package com.cybershield.controller;

import com.cybershield.algorithms.strings.AhoCorasickAlgorithm;
import com.cybershield.algorithms.strings.KmpAlgorithm;
import com.cybershield.algorithms.strings.RabinKarpAlgorithm;
import com.cybershield.algorithms.strings.ZFunctionAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.service.StringAlgorithmService;
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
@Tag(name = "M1 String Algorithms", description = "Exact pattern matching and multi-pattern string search algorithms")
public class StringAlgorithmController {

    private final StringAlgorithmService stringAlgorithmService;

    @Operation(summary = "KMP String Matching", description = "Executes Knuth-Morris-Pratt pattern search with LPS table construction and fallback tracing")
    @PostMapping("/kmp")
    public ResponseEntity<AlgorithmResponse<KmpAlgorithm.KmpResult>> executeKmp(@Valid @RequestBody KmpRequest request) {
        return ResponseEntity.ok(stringAlgorithmService.executeKmp(request));
    }

    @Operation(summary = "Z-Function Pattern Matching", description = "Executes Z-algorithm linear-time prefix match box computation")
    @PostMapping("/z-function")
    public ResponseEntity<AlgorithmResponse<ZFunctionAlgorithm.ZFunctionResult>> executeZFunction(@Valid @RequestBody ZFunctionRequest request) {
        return ResponseEntity.ok(stringAlgorithmService.executeZFunction(request));
    }

    @Operation(summary = "Rabin-Karp Rolling Hash", description = "Executes polynomial rolling hash pattern matching with collision tracking")
    @PostMapping("/rabin-karp")
    public ResponseEntity<AlgorithmResponse<RabinKarpAlgorithm.RabinKarpResult>> executeRabinKarp(@Valid @RequestBody RabinKarpRequest request) {
        return ResponseEntity.ok(stringAlgorithmService.executeRabinKarp(request));
    }

    @Operation(summary = "Aho-Corasick Multi-Pattern Search", description = "Executes Aho-Corasick automaton with BFS failure transitions and output propagation")
    @PostMapping("/aho-corasick")
    public ResponseEntity<AlgorithmResponse<AhoCorasickAlgorithm.AhoCorasickResult>> executeAhoCorasick(@Valid @RequestBody AhoCorasickRequest request) {
        return ResponseEntity.ok(stringAlgorithmService.executeAhoCorasick(request));
    }
}
