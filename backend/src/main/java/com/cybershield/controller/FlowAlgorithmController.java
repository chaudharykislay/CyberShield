package com.cybershield.controller;

import com.cybershield.algorithms.graph.BipartiteMatchingAlgorithm;
import com.cybershield.algorithms.graph.MinCutAlgorithm;
import com.cybershield.dto.*;
import com.cybershield.service.FlowAlgorithmService;
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
@Tag(name = "M4 Network Flow", description = "Max-Flow (Ford-Fulkerson, Edmonds-Karp, Dinic), Bipartite Matching, and Min-Cut algorithms")
public class FlowAlgorithmController {

    private final FlowAlgorithmService flowAlgorithmService;

    @Operation(summary = "Maximum Network Flow", description = "Executes maximum network flow using Ford-Fulkerson, Edmonds-Karp, or Dinic's blocking flow")
    @PostMapping("/max-flow")
    public ResponseEntity<AlgorithmResponse<Object>> executeMaxFlow(@Valid @RequestBody FlowGraphRequest request) {
        return ResponseEntity.ok(flowAlgorithmService.executeMaxFlow(request));
    }

    @Operation(summary = "Bipartite Matching (SecOps Alert Triage)", description = "Finds maximum cardinality bipartite matching pairing analysts with active alerts")
    @PostMapping("/bipartite-matching")
    public ResponseEntity<AlgorithmResponse<BipartiteMatchingAlgorithm.MatchingResult>> executeBipartiteMatching(@Valid @RequestBody BipartiteMatchingRequest request) {
        return ResponseEntity.ok(flowAlgorithmService.executeBipartiteMatching(request));
    }

    @Operation(summary = "Minimum Cut Computation", description = "Computes minimum capacity s-t cut separating network partitions using max-flow min-cut theorem")
    @PostMapping("/min-cut")
    public ResponseEntity<AlgorithmResponse<MinCutAlgorithm.MinCutResult>> executeMinCut(@Valid @RequestBody FlowGraphRequest request) {
        return ResponseEntity.ok(flowAlgorithmService.executeMinCut(request));
    }
}
