package com.cybershield.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlowGraphRequest {

    @Min(value = 2, message = "Network must have at least 2 nodes")
    @Max(value = 50, message = "Nodes cannot exceed 50")
    private int nodes;

    @NotEmpty(message = "Edges cannot be empty")
    private List<FlowEdgeDto> edges;

    @Min(0)
    private int source;

    @Min(0)
    private int sink;

    private String flowAlgorithm; // FORD_FULKERSON, EDMONDS_KARP, DINIC
}
