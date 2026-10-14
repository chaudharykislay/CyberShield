package com.cybershield.algorithms.graph;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class FlowGraph {
    private final int nodes;
    private final int[][] capacity;
    private final int[][] flow;
    private final List<List<Integer>> adj;

    public FlowGraph(int nodes) {
        this.nodes = nodes;
        this.capacity = new int[nodes][nodes];
        this.flow = new int[nodes][nodes];
        this.adj = new ArrayList<>();
        for (int i = 0; i < nodes; i++) {
            this.adj.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v, int cap) {
        if (u >= 0 && u < nodes && v >= 0 && v < nodes) {
            capacity[u][v] += cap;
            if (!adj.get(u).contains(v)) adj.get(u).add(v);
            if (!adj.get(v).contains(u)) adj.get(v).add(u);
        }
    }

    public int residualCapacity(int u, int v) {
        return capacity[u][v] - flow[u][v];
    }
}
