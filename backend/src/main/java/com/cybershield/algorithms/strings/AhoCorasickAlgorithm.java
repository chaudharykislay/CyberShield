package com.cybershield.algorithms.strings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

public class AhoCorasickAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AhoCorasickMatch {
        private String pattern;
        private int position; // start index in text
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrieNodeVisualization {
        private int id;
        private Character character;
        private Map<Character, Integer> children;
        private int failureLinkTarget;
        private List<String> outputPatterns;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AhoCorasickResult {
        private List<AhoCorasickMatch> matches;
        private List<TrieNodeVisualization> trieNodes;
        private long comparisonCount;
        private List<String> trace;

        public int getTotalMatches() {
            return matches != null ? matches.size() : 0;
        }
    }

    private static class Node {
        final int id;
        Character character;
        final Map<Character, Node> children = new TreeMap<>();
        Node failureLink;
        final Set<String> outputs = new TreeSet<>();

        Node(int id, Character character) {
            this.id = id;
            this.character = character;
        }
    }

    public AhoCorasickResult search(String text, List<String> patterns) {
        List<String> trace = new ArrayList<>();
        List<AhoCorasickMatch> matches = new ArrayList<>();
        long comparisons = 0;

        if (text == null || patterns == null || patterns.isEmpty()) {
            return AhoCorasickResult.builder()
                    .matches(Collections.emptyList())
                    .trieNodes(Collections.emptyList())
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int[] nodeCounter = new int[]{0};
        Node root = new Node(nodeCounter[0]++, null);
        List<Node> allNodes = new ArrayList<>();
        allNodes.add(root);

        // 1. Build trie
        for (String pattern : patterns) {
            if (pattern == null || pattern.isEmpty()) continue;
            Node current = root;
            for (char c : pattern.toCharArray()) {
                if (!current.children.containsKey(c)) {
                    Node child = new Node(nodeCounter[0]++, c);
                    current.children.put(c, child);
                    allNodes.add(child);
                }
                current = current.children.get(c);
            }
            current.outputs.add(pattern);
        }

        // 2. Build failure links and dictionary output links via BFS
        Queue<Node> queue = new ArrayDeque<>();
        for (Map.Entry<Character, Node> entry : root.children.entrySet()) {
            Node child = entry.getValue();
            child.failureLink = root;
            queue.add(child);
            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Root child node %d (char '%c') failure link -> root (node %d)", child.id, entry.getKey(), root.id));
            }
        }
        root.failureLink = root;

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            for (Map.Entry<Character, Node> entry : current.children.entrySet()) {
                char c = entry.getKey();
                Node child = entry.getValue();

                Node fail = current.failureLink;
                while (fail != root && !fail.children.containsKey(c)) {
                    fail = fail.failureLink;
                }
                if (fail.children.containsKey(c) && fail.children.get(c) != child) {
                    child.failureLink = fail.children.get(c);
                } else {
                    child.failureLink = root;
                }

                // Propagate output patterns
                child.outputs.addAll(child.failureLink.outputs);
                queue.add(child);

                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Node %d (char '%c') failure link set to node %d", child.id, c, child.failureLink.id));
                }
            }
        }

        // 3. Search text
        Node current = root;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            comparisons++;

            while (current != root && !current.children.containsKey(c)) {
                current = current.failureLink;
                comparisons++;
            }

            if (current.children.containsKey(c)) {
                current = current.children.get(c);
            } else {
                current = root;
            }

            if (!current.outputs.isEmpty()) {
                for (String pat : current.outputs) {
                    int matchPos = i - pat.length() + 1;
                    matches.add(new AhoCorasickMatch(pat, matchPos));
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Found pattern '%s' at text position %d (ending at %d)", pat, matchPos, i));
                    }
                }
            }
        }

        // 4. Build visualization representation
        List<TrieNodeVisualization> visNodes = new ArrayList<>();
        for (Node n : allNodes) {
            Map<Character, Integer> childMap = new HashMap<>();
            for (Map.Entry<Character, Node> e : n.children.entrySet()) {
                childMap.put(e.getKey(), e.getValue().id);
            }
            visNodes.add(TrieNodeVisualization.builder()
                    .id(n.id)
                    .character(n.character)
                    .children(childMap)
                    .failureLinkTarget(n.failureLink != null ? n.failureLink.id : root.id)
                    .outputPatterns(new ArrayList<>(n.outputs))
                    .build());
        }

        return AhoCorasickResult.builder()
                .matches(matches)
                .trieNodes(visNodes)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
