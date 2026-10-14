package com.cybershield.controller;

import com.cybershield.algorithms.suffix.LcpKasaiAlgorithm;
import com.cybershield.algorithms.suffix.SaisAlgorithm;
import com.cybershield.algorithms.suffix.SuffixArrayAlgorithm;
import com.cybershield.algorithms.suffix.SuffixAutomatonAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.service.SuffixAlgorithmService;
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
@Tag(name = "M2 Suffix Structures", description = "Suffix arrays, SA-IS linear sorting, Kasai LCP, and Suffix Automata (DAWG)")
public class SuffixAlgorithmController {

    private final SuffixAlgorithmService suffixAlgorithmService;

    @Operation(summary = "Suffix Array (Comparator-based)", description = "Constructs suffix array using O(n log^2 n) comparator and performs binary search pattern queries")
    @PostMapping("/suffix-array")
    public ResponseEntity<AlgorithmResponse<SuffixArrayAlgorithm.SuffixArrayResult>> executeSuffixArray(@Valid @RequestBody SuffixArrayRequest request) {
        return ResponseEntity.ok(suffixAlgorithmService.executeSuffixArray(request));
    }

    @Operation(summary = "SA-IS Linear Induced Sorting", description = "Linear O(n) Suffix Array Induced Sorting with S/L type classification and LMS recursion")
    @PostMapping("/sa-is")
    public ResponseEntity<AlgorithmResponse<SaisAlgorithm.SaisResult>> executeSais(@Valid @RequestBody SaisRequest request) {
        return ResponseEntity.ok(suffixAlgorithmService.executeSais(request));
    }

    @Operation(summary = "Kasai LCP Computation", description = "Computes Longest Common Prefix array in O(n) time using inverse rank lookup")
    @PostMapping("/lcp-kasai")
    public ResponseEntity<AlgorithmResponse<LcpKasaiAlgorithm.LcpResult>> executeLcpKasai(@Valid @RequestBody LcpKasaiRequest request) {
        return ResponseEntity.ok(suffixAlgorithmService.executeLcpKasai(request));
    }

    @Operation(summary = "Suffix Automaton (DAWG)", description = "Online construction of linear-size Directed Acyclic Word Graph with substring search")
    @PostMapping("/suffix-automaton")
    public ResponseEntity<AlgorithmResponse<SuffixAutomatonAlgorithm.AutomatonResult>> executeSuffixAutomaton(@Valid @RequestBody SuffixAutomatonRequest request) {
        return ResponseEntity.ok(suffixAlgorithmService.executeSuffixAutomaton(request));
    }
}
