package com.cybershield.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditDistanceRequest {
    private String source;
    private String target;

    private String str1;
    private String str2;

    private String mode; // LEVENSHTEIN, DAMERAU_OSA, WEIGHTED
    private String variant;

    public String getSource() {
        return source != null ? source : (str1 != null ? str1 : "");
    }

    public String getTarget() {
        return target != null ? target : (str2 != null ? str2 : "");
    }

    public String getMode() {
        return mode != null ? mode : (variant != null ? variant : "LEVENSHTEIN");
    }

    private Integer insertCost;
    private Integer deleteCost;
    private Integer substituteCost;

    @JsonProperty("costs")
    public void setCosts(Map<String, Integer> costs) {
        if (costs != null) {
            if (costs.containsKey("insert")) this.insertCost = costs.get("insert");
            if (costs.containsKey("delete")) this.deleteCost = costs.get("delete");
            if (costs.containsKey("substitute")) this.substituteCost = costs.get("substitute");
        }
    }
}
