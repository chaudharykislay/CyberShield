package com.cybershield.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchmarkRequest {

    private String algorithmId; // kmp, z-function, rabin-karp, aho-corasick, etc. (or module name)

    private String module; // M1, M2, M3, M4, M6

    private Integer inputSize;

    private Integer warmup;

    private String text;

    private String pattern;

    @Min(value = 1, message = "Iterations must be at least 1")
    @Max(value = 50, message = "Iterations cannot exceed 50")
    @Builder.Default
    private int iterations = 10;

    // Explicit standard accessors for total IDE / JDT / javac compatibility
    public String getAlgorithmId() {
        return algorithmId;
    }

    public void setAlgorithmId(String algorithmId) {
        this.algorithmId = algorithmId;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public Integer getInputSize() {
        return inputSize;
    }

    public void setInputSize(Integer inputSize) {
        this.inputSize = inputSize;
    }

    public Integer getWarmup() {
        return warmup;
    }

    public void setWarmup(Integer warmup) {
        this.warmup = warmup;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public int getIterations() {
        return iterations;
    }

    public void setIterations(int iterations) {
        this.iterations = iterations;
    }

    // Explicit builder for environments where Lombok annotation processing is not active
    public static BenchmarkRequestBuilder builder() {
        return new BenchmarkRequestBuilder();
    }

    public static class BenchmarkRequestBuilder {
        private String algorithmId;
        private String module;
        private Integer inputSize;
        private Integer warmup;
        private String text;
        private String pattern;
        private int iterations = 10;

        public BenchmarkRequestBuilder algorithmId(String algorithmId) {
            this.algorithmId = algorithmId;
            return this;
        }

        public BenchmarkRequestBuilder module(String module) {
            this.module = module;
            return this;
        }

        public BenchmarkRequestBuilder inputSize(Integer inputSize) {
            this.inputSize = inputSize;
            return this;
        }

        public BenchmarkRequestBuilder warmup(Integer warmup) {
            this.warmup = warmup;
            return this;
        }

        public BenchmarkRequestBuilder text(String text) {
            this.text = text;
            return this;
        }

        public BenchmarkRequestBuilder pattern(String pattern) {
            this.pattern = pattern;
            return this;
        }

        public BenchmarkRequestBuilder iterations(int iterations) {
            this.iterations = iterations;
            return this;
        }

        public BenchmarkRequest build() {
            BenchmarkRequest req = new BenchmarkRequest();
            req.setAlgorithmId(this.algorithmId);
            req.setModule(this.module);
            req.setInputSize(this.inputSize);
            req.setWarmup(this.warmup);
            req.setText(this.text);
            req.setPattern(this.pattern);
            req.setIterations(this.iterations);
            return req;
        }
    }
}
