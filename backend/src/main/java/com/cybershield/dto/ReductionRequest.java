package com.cybershield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReductionRequest {
    private String type; // SAT_TO_CLIQUE, CLIQUE_TO_IS, IS_TO_VC
    private List<List<Integer>> clauses;
    private Integer vertexCount;
    private List<int[]> edges;
    private Integer k;
    private List<Integer> independentSet;
}
