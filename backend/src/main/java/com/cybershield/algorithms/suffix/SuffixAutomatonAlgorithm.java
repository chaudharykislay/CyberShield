package com.cybershield.algorithms.suffix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Real Suffix Automaton (DAWG - Directed Acyclic Word Graph).
 * Linear time and space O(n) automaton recognizing all substrings of a text.
 *
 * NOTE: SuffixTree is a separate, more complex tree structure marked as PLANNED.
 */
public class SuffixAutomatonAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StateDto {
        private int id;
        private int len;
        private int link;
        private Map<Character, Integer> transitions;
        private boolean isClone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AutomatonResult {
        private int statesCount;
        private int transitionsCount;
        private boolean queryFound;
        private int queryMatchOccurrences;
        private List<StateDto> states;
        private long comparisonCount;
        private List<String> trace;
    }

    public static class State {
        public int id;
        public int len;
        public int link;
        public Map<Character, Integer> next = new TreeMap<>();
        public boolean isClone = false;

        public State(int id, int len, int link) {
            this.id = id;
            this.len = len;
            this.link = link;
        }
    }

    public AutomatonResult buildAndQuery(String text, String query) {
        List<String> trace = new ArrayList<>();
        List<State> states = new ArrayList<>();
        long comparisons = 0;

        if (text == null || text.isEmpty()) {
            return AutomatonResult.builder()
                    .statesCount(0)
                    .transitionsCount(0)
                    .queryFound(false)
                    .queryMatchOccurrences(0)
                    .states(Collections.emptyList())
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        // Initialize root state
        State root = new State(0, 0, -1);
        states.add(root);
        int last = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            int cur = states.size();
            State curState = new State(cur, states.get(last).len + 1, 0);
            states.add(curState);

            int p = last;
            while (p != -1 && !states.get(p).next.containsKey(c)) {
                states.get(p).next.put(c, cur);
                p = states.get(p).link;
            }

            if (p == -1) {
                curState.link = 0;
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Added char '%c': state %d created (len=%d), link -> 0", c, cur, curState.len));
                }
            } else {
                int q = states.get(p).next.get(c);
                if (states.get(p).len + 1 == states.get(q).len) {
                    curState.link = q;
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Added char '%c': continuous transition to state %d, link -> %d", c, cur, q));
                    }
                } else {
                    int clone = states.size();
                    State cloneState = new State(clone, states.get(p).len + 1, states.get(q).link);
                    cloneState.next.putAll(states.get(q).next);
                    cloneState.isClone = true;
                    states.add(cloneState);

                    while (p != -1 && states.get(p).next.get(c) != null && states.get(p).next.get(c) == q) {
                        states.get(p).next.put(c, clone);
                        p = states.get(p).link;
                    }
                    states.get(q).link = clone;
                    curState.link = clone;

                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Added char '%c': split state %d, created clone state %d (len=%d)", c, q, clone, cloneState.len));
                    }
                }
            }
            last = cur;
        }

        // Calculate transitions count
        int totalTransitions = 0;
        for (State s : states) {
            totalTransitions += s.next.size();
        }

        // Substring query verification
        boolean queryFound = false;
        int occurrences = 0;
        if (query != null && !query.isEmpty()) {
            int curr = 0;
            queryFound = true;
            for (char ch : query.toCharArray()) {
                comparisons++;
                if (states.get(curr).next.containsKey(ch)) {
                    curr = states.get(curr).next.get(ch);
                } else {
                    queryFound = false;
                    break;
                }
            }
            if (queryFound) {
                occurrences = countEndpos(states, curr);
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Query '%s' found in DAWG at state %d (occurrences: %d)", query, curr, occurrences));
                }
            } else {
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Query '%s' NOT found in DAWG", query));
                }
            }
        }

        List<StateDto> dtos = new ArrayList<>();
        for (State s : states) {
            dtos.add(StateDto.builder()
                    .id(s.id)
                    .len(s.len)
                    .link(s.link)
                    .transitions(new HashMap<>(s.next))
                    .isClone(s.isClone)
                    .build());
        }

        return AutomatonResult.builder()
                .statesCount(states.size())
                .transitionsCount(totalTransitions)
                .queryFound(queryFound)
                .queryMatchOccurrences(occurrences)
                .states(dtos)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }

    private int countEndpos(List<State> states, int stateId) {
        // Count leaf paths or valid end positions reachable
        int count = states.get(stateId).isClone ? 0 : 1;
        for (Map.Entry<Character, Integer> entry : states.get(stateId).next.entrySet()) {
            count += countEndpos(states, entry.getValue());
        }
        return Math.max(1, count);
    }
}
