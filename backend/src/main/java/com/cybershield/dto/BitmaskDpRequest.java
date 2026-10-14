package com.cybershield.dto;

import com.cybershield.algorithms.dp.BitmaskDpAlgorithm.SecurityRuleInput;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BitmaskDpRequest {

    @JsonAlias({"numPolicies", "policiesCount"})
    @Min(value = 1, message = "Policies count must be at least 1")
    @Max(value = 20, message = "Policies count cannot exceed 20")
    @Builder.Default
    private int numPolicies = 5;

    @NotEmpty(message = "Rules cannot be empty")
    @Size(max = 20, message = "Rules count cannot exceed 20")
    private List<SecurityRuleInput> rules;

    public void setRules(List<SecurityRuleInput> rules) {
        this.rules = rules;
        inferNumPolicies();
    }

    @JsonProperty("requiredPolicies")
    public void setRequiredPolicies(List<Integer> requiredPolicies) {
        if (requiredPolicies != null && !requiredPolicies.isEmpty()) {
            int maxP = 0;
            for (Integer p : requiredPolicies) {
                if (p != null && p >= maxP) maxP = p + 1;
            }
            this.numPolicies = Math.min(20, Math.max(requiredPolicies.size(), maxP));
        }
    }

    private void inferNumPolicies() {
        if (this.rules != null && !this.rules.isEmpty()) {
            int maxP = 0;
            for (SecurityRuleInput r : this.rules) {
                if (r.getCoveredPolicies() != null) {
                    for (Integer p : r.getCoveredPolicies()) {
                        if (p != null && p >= maxP) maxP = p + 1;
                    }
                }
            }
            if (maxP > 0) {
                this.numPolicies = Math.min(20, maxP);
            }
        }
    }
}
