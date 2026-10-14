package com.cybershield.controller;

import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.model.AnalysisFinding;
import com.cybershield.repository.AnalysisExecutionRepository;
import com.cybershield.repository.AnalysisFindingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/executions")
@RequiredArgsConstructor
@Tag(name = "Execution History", description = "Query algorithm execution logs, findings, and metrics")
public class ExecutionHistoryController {

    private final AnalysisExecutionRepository executionRepository;
    private final AnalysisFindingRepository findingRepository;

    @Operation(summary = "Query Algorithm Executions", description = "Retrieves paginated algorithm run records with filters")
    @GetMapping
    public ResponseEntity<Page<AnalysisExecution>> getExecutions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String algorithmId,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AnalysisExecution> result;

        if (algorithmId != null && !algorithmId.isBlank() && status != null && !status.isBlank()) {
            result = executionRepository.findByAlgorithmIdAndStatus(algorithmId, status, pageable);
        } else if (algorithmId != null && !algorithmId.isBlank()) {
            result = executionRepository.findByAlgorithmId(algorithmId, pageable);
        } else if (status != null && !status.isBlank()) {
            result = executionRepository.findByStatus(status, pageable);
        } else {
            result = executionRepository.findAll(pageable);
        }

        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get Execution Record by Execution ID", description = "Fetches a specific execution log by execution UUID")
    @GetMapping("/{executionId}")
    public ResponseEntity<AnalysisExecution> getExecutionByExecutionId(@PathVariable String executionId) {
        return executionRepository.findByExecutionId(executionId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis execution not found with ID: " + executionId));
    }

    @Operation(summary = "Get Findings for Execution", description = "Fetches threat findings discovered during a specific execution")
    @GetMapping("/{executionId}/findings")
    public ResponseEntity<List<AnalysisFinding>> getFindingsByExecutionId(@PathVariable String executionId) {
        return ResponseEntity.ok(findingRepository.findByExecutionId(executionId));
    }
}
