package com.cybershield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmCatalogItem {
    private String id;
    private String name;
    private String module; // M1, M2, M3, M4, M5, M6
    private String co;     // CO1, CO2, CO3, CO4, CO5, CO6
    private String description;
    private String timeComplexity;
    private String spaceComplexity;
    private String endpoint;
    private String status; // IMPLEMENTED, PLANNED
}
