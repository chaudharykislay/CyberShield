package com.cybershield.controller;

import com.cybershield.algorithms.np.ReductionAlgorithm;
import com.cybershield.algorithms.np.SatSolverAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.service.NpAlgorithmService;
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
@Tag(name = "M5 NP-Completeness & Reductions", description = "DPLL SAT solver, polynomial-time reductions (3-SAT -> CLIQUE -> IS -> VC), and 2-approximation algorithms")
public class NpAlgorithmController {

    private final NpAlgorithmService npAlgorithmService;

    @Operation(summary = "DPLL Boolean Satisfiability (SAT)", description = "Exhaustive DPLL solver with unit propagation and complete search verification (up to 20 variables)")
    @PostMapping("/sat")
    public ResponseEntity<AlgorithmResponse<SatSolverAlgorithm.SatResult>> executeSat(@Valid @RequestBody SatRequest request) {
        return ResponseEntity.ok(npAlgorithmService.executeSat(request));
    }

    @Operation(summary = "Polynomial-Time Reductions", description = "Executes formal reductions: 3-SAT to CLIQUE, CLIQUE to INDEPENDENT SET, or INDEPENDENT SET to VERTEX COVER")
    @PostMapping("/reductions")
    public ResponseEntity<AlgorithmResponse<Object>> executeReduction(@Valid @RequestBody ReductionRequest request) {
        return ResponseEntity.ok(npAlgorithmService.executeReduction(request));
    }

    @Operation(summary = "Vertex Cover 2-Approximation", description = "Guaranteed 2-approximation for Vertex Cover using maximal matching greedy edge selection")
    @PostMapping("/vertex-cover")
    public ResponseEntity<AlgorithmResponse<ReductionAlgorithm.VertexCoverApproxResult>> executeVertexCover(@Valid @RequestBody VertexCoverRequest request) {
        return ResponseEntity.ok(npAlgorithmService.executeVertexCover(request));
    }
}
