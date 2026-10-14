package com.cybershield.controller;

import com.cybershield.algorithms.dp.BitmaskDpAlgorithm;
import com.cybershield.algorithms.dp.EditDistanceAlgorithm;
import com.cybershield.algorithms.dp.MatrixChainAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.service.DpAlgorithmService;
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
@Tag(name = "M3 Dynamic Programming", description = "Edit distance variants, bitmask policy selection DP, and matrix chain multiplication")
public class DpAlgorithmController {

    private final DpAlgorithmService dpAlgorithmService;

    @Operation(summary = "Edit Distance", description = "Computes Levenshtein, Damerau-OSA, or weighted edit distance with alignment backtrack")
    @PostMapping("/edit-distance")
    public ResponseEntity<AlgorithmResponse<EditDistanceAlgorithm.EditDistanceResult>> executeEditDistance(@Valid @RequestBody EditDistanceRequest request) {
        return ResponseEntity.ok(dpAlgorithmService.executeEditDistance(request));
    }

    @Operation(summary = "Bitmask DP Security Rule Activation", description = "Solves minimum cost security rule coverage problem using bitmask dynamic programming")
    @PostMapping("/bitmask-dp")
    public ResponseEntity<AlgorithmResponse<BitmaskDpAlgorithm.BitmaskDpResult>> executeBitmaskDp(@Valid @RequestBody BitmaskDpRequest request) {
        return ResponseEntity.ok(dpAlgorithmService.executeBitmaskDp(request));
    }

    @Operation(summary = "Matrix Chain Multiplication DP", description = "Finds optimal parenthesization for matrix multiplication chain minimizing scalar ops")
    @PostMapping("/matrix-chain")
    public ResponseEntity<AlgorithmResponse<MatrixChainAlgorithm.MatrixChainResult>> executeMatrixChain(@Valid @RequestBody MatrixChainRequest request) {
        return ResponseEntity.ok(dpAlgorithmService.executeMatrixChain(request));
    }
}
