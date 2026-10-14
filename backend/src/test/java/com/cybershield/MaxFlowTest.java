package com.cybershield;

import com.cybershield.algorithms.graph.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MaxFlowTest {

    private FlowGraph createClrsGraph() {
        // CLRS Section 26.2 Flow Network: 6 vertices (0..5)
        // 0: s, 1: v1, 2: v2, 3: v3, 4: v4, 5: t
        FlowGraph g = new FlowGraph(6);
        g.addEdge(0, 1, 16);
        g.addEdge(0, 2, 13);
        g.addEdge(1, 2, 10);
        g.addEdge(2, 1, 4);
        g.addEdge(1, 3, 12);
        g.addEdge(3, 2, 9);
        g.addEdge(2, 4, 14);
        g.addEdge(4, 3, 7);
        g.addEdge(3, 5, 20);
        g.addEdge(4, 5, 4);
        return g;
    }

    @Test
    void testEdmondsKarpClrsExample() {
        FlowGraph g = createClrsGraph();
        EdmondsKarpAlgorithm ek = new EdmondsKarpAlgorithm();
        EdmondsKarpAlgorithm.EdmondsKarpResult result = ek.solve(g, 0, 5);

        assertEquals(23, result.getMaxFlow());
        assertFalse(result.getPhases().isEmpty());
    }

    @Test
    void testFordFulkersonClrsExample() {
        FlowGraph g = createClrsGraph();
        MaxFlowAlgorithm ff = new MaxFlowAlgorithm();
        MaxFlowAlgorithm.MaxFlowResult result = ff.solve(g, 0, 5);

        assertEquals(23, result.getMaxFlow());
    }

    @Test
    void testDinicsClrsExample() {
        FlowGraph g = createClrsGraph();
        DinicsAlgorithm dinic = new DinicsAlgorithm();
        DinicsAlgorithm.DinicsResult result = dinic.solve(g, 0, 5);

        assertEquals(23, result.getMaxFlow());
    }

    @Test
    void testMinCutClrsExample() {
        FlowGraph g = createClrsGraph();
        MinCutAlgorithm mc = new MinCutAlgorithm();
        MinCutAlgorithm.MinCutResult result = mc.computeMinCut(g, 0, 5);

        assertEquals(23, result.getMaxFlow());
        assertEquals(23, result.getCutCapacity());
        assertTrue(result.getSourcePartition().contains(0));
        assertTrue(result.getSinkPartition().contains(5));
    }
}
