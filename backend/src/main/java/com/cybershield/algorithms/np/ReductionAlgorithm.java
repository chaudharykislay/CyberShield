package com.cybershield.algorithms.np;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

public class ReductionAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReductionVertex {
        private int vertexId;
        private int clauseIndex;
        private int literal;
        private String varName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CliqueReductionResult {
        private List<ReductionVertex> vertices;
        private List<int[]> edges;
        private int targetCliqueSize;
        private int totalVertices;
        private int totalEdges;
        private List<String> trace;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IndependentSetReductionResult {
        private int vertexCount;
        private List<int[]> originalEdges;
        private List<int[]> complementEdges;
        private int targetIndependentSetSize;
        private List<String> trace;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VertexCoverReductionResult {
        private int vertexCount;
        private List<Integer> vertexCover;
        private List<Integer> independentSet;
        private boolean isCoveringAllEdges;
        private List<String> trace;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VertexCoverApproxResult {
        private List<Integer> selectedVertices;
        private List<int[]> coveredEdges;
        private double approximationRatio;
        private int vertexCoverSize;
        private List<String> trace;

        public int getCoverSize() {
            return vertexCoverSize;
        }
    }

    public CliqueReductionResult reduce3SatToClique(List<List<Integer>> clauses) {
        List<String> trace = new ArrayList<>();
        List<ReductionVertex> vertices = new ArrayList<>();
        List<int[]> edges = new ArrayList<>();

        if (clauses == null || clauses.isEmpty()) {
            return CliqueReductionResult.builder()
                    .vertices(Collections.emptyList())
                    .edges(Collections.emptyList())
                    .targetCliqueSize(0)
                    .totalVertices(0)
                    .totalEdges(0)
                    .trace(trace)
                    .build();
        }

        int vId = 0;
        for (int cIdx = 0; cIdx < clauses.size(); cIdx++) {
            List<Integer> clause = clauses.get(cIdx);
            for (int lit : clause) {
                String varName = (lit > 0 ? "x" : "¬x") + Math.abs(lit);
                vertices.add(new ReductionVertex(vId++, cIdx, lit, varName));
            }
        }

        int totalV = vertices.size();
        for (int i = 0; i < totalV; i++) {
            for (int j = i + 1; j < totalV; j++) {
                ReductionVertex u = vertices.get(i);
                ReductionVertex v = vertices.get(j);

                // Add edge if in different clauses and not complementary
                if (u.getClauseIndex() != v.getClauseIndex() && u.getLiteral() != -v.getLiteral()) {
                    edges.add(new int[]{u.getVertexId(), v.getVertexId()});
                }
            }
        }

        int targetClique = clauses.size();
        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("3-SAT with %d clauses reduced to CLIQUE graph with %d vertices and %d edges.",
                    clauses.size(), totalV, edges.size()));
            trace.add(String.format("Target CLIQUE size k = %d (one vertex selected per clause without contradiction)", targetClique));
        }

        return CliqueReductionResult.builder()
                .vertices(vertices)
                .edges(edges)
                .targetCliqueSize(targetClique)
                .totalVertices(totalV)
                .totalEdges(edges.size())
                .trace(trace)
                .build();
    }

    public IndependentSetReductionResult reduceCliqueToIndependentSet(int vertexCount, List<int[]> cliqueEdges, int cliqueSize) {
        List<String> trace = new ArrayList<>();
        boolean[][] edgeMatrix = new boolean[vertexCount][vertexCount];

        if (cliqueEdges != null) {
            for (int[] e : cliqueEdges) {
                if (e.length >= 2 && e[0] < vertexCount && e[1] < vertexCount) {
                    edgeMatrix[e[0]][e[1]] = true;
                    edgeMatrix[e[1]][e[0]] = true;
                }
            }
        }

        List<int[]> complementEdges = new ArrayList<>();
        for (int i = 0; i < vertexCount; i++) {
            for (int j = i + 1; j < vertexCount; j++) {
                if (!edgeMatrix[i][j]) {
                    complementEdges.add(new int[]{i, j});
                }
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Built complement graph G' with %d vertices and %d complement edges.", vertexCount, complementEdges.size()));
            trace.add(String.format("A clique of size %d in G is an independent set of size %d in G'.", cliqueSize, cliqueSize));
        }

        return IndependentSetReductionResult.builder()
                .vertexCount(vertexCount)
                .originalEdges(cliqueEdges != null ? cliqueEdges : Collections.emptyList())
                .complementEdges(complementEdges)
                .targetIndependentSetSize(cliqueSize)
                .trace(trace)
                .build();
    }

    public VertexCoverReductionResult reduceIndependentSetToVertexCover(int vertexCount, List<int[]> edges, List<Integer> independentSet) {
        List<String> trace = new ArrayList<>();
        Set<Integer> isSet = new HashSet<>(independentSet != null ? independentSet : Collections.emptyList());
        List<Integer> vertexCover = new ArrayList<>();

        for (int i = 0; i < vertexCount; i++) {
            if (!isSet.contains(i)) {
                vertexCover.add(i);
            }
        }

        // Verify vertex cover property: every edge must have at least one endpoint in vertexCover
        boolean coversAll = true;
        if (edges != null) {
            for (int[] e : edges) {
                if (e.length >= 2) {
                    if (!vertexCover.contains(e[0]) && !vertexCover.contains(e[1])) {
                        coversAll = false;
                        if (trace.size() < MAX_TRACE_SIZE) {
                            trace.add(String.format("Violation: Edge (%d, %d) uncovered!", e[0], e[1]));
                        }
                        break;
                    }
                }
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Independent set size: %d, resulting Vertex Cover size: %d (V \\ IS).", isSet.size(), vertexCover.size()));
            trace.add("All edges covered: " + coversAll);
        }

        return VertexCoverReductionResult.builder()
                .vertexCount(vertexCount)
                .vertexCover(vertexCover)
                .independentSet(new ArrayList<>(isSet))
                .isCoveringAllEdges(coversAll)
                .trace(trace)
                .build();
    }

    public VertexCoverApproxResult approximateVertexCover2(int vertexCount, List<int[]> edges) {
        List<String> trace = new ArrayList<>();
        List<Integer> selectedVertices = new ArrayList<>();
        List<int[]> coveredEdges = new ArrayList<>();

        if (edges == null || edges.isEmpty()) {
            return VertexCoverApproxResult.builder()
                    .selectedVertices(Collections.emptyList())
                    .coveredEdges(Collections.emptyList())
                    .approximationRatio(1.0)
                    .vertexCoverSize(0)
                    .trace(trace)
                    .build();
        }

        Set<Integer> inCover = new HashSet<>();
        for (int[] e : edges) {
            if (e.length >= 2) {
                int u = e[0];
                int v = e[1];
                if (!inCover.contains(u) && !inCover.contains(v)) {
                    inCover.add(u);
                    inCover.add(v);
                    selectedVertices.add(u);
                    selectedVertices.add(v);
                    coveredEdges.add(e);

                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Selected edge (%d, %d): added both vertices to cover.", u, v));
                    }
                }
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("2-Approximation completed: %d vertices in cover, approximation ratio <= 2.0 guaranteed.", inCover.size()));
        }

        return VertexCoverApproxResult.builder()
                .selectedVertices(selectedVertices)
                .coveredEdges(coveredEdges)
                .approximationRatio(2.0)
                .vertexCoverSize(inCover.size())
                .trace(trace)
                .build();
    }
}
