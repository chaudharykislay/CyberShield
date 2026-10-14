package com.cybershield.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VertexCoverRequest {

    @Min(value = 1, message = "Vertex count must be positive")
    private int vertexCount;

    @NotNull(message = "Edges cannot be null")
    private List<int[]> edges;
}
