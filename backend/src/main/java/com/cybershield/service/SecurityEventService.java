package com.cybershield.service;

import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.model.SecurityEvent;
import com.cybershield.repository.SecurityEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class SecurityEventService {

    private final SecurityEventRepository eventRepository;

    public SecurityEventService(SecurityEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Page<SecurityEvent> getEvents(int page, int size, String type, String severity) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        if (type != null && !type.isBlank() && severity != null && !severity.isBlank()) {
            return eventRepository.findByTypeAndSeverity(type, severity, pageable);
        } else if (type != null && !type.isBlank()) {
            return eventRepository.findByType(type, pageable);
        } else if (severity != null && !severity.isBlank()) {
            return eventRepository.findBySeverity(severity, pageable);
        } else {
            return eventRepository.findAll(pageable);
        }
    }

    public SecurityEvent getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Security event not found with ID: " + id));
    }

    public SecurityEvent createEvent(SecurityEvent event) {
        if (event.getEventId() == null || event.getEventId().isBlank()) {
            event.setEventId("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (event.getTimestamp() == null) {
            event.setTimestamp(Instant.now());
        }
        return eventRepository.save(event);
    }
}
