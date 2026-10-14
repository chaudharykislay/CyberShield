package com.cybershield.controller;

import com.cybershield.model.SecurityEvent;
import com.cybershield.service.SecurityEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Tag(name = "Security Events", description = "Query and register enterprise security events and alerts")
public class EventController {

    private final SecurityEventService eventService;

    @Operation(summary = "Query Security Events", description = "Retrieves paginated security events filtered optionally by event type and severity")
    @GetMapping
    public ResponseEntity<Page<SecurityEvent>> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String severity) {
        return ResponseEntity.ok(eventService.getEvents(page, size, type, severity));
    }

    @Operation(summary = "Get Security Event by ID", description = "Fetches a specific security event by database primary key ID")
    @GetMapping("/{id}")
    public ResponseEntity<SecurityEvent> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @Operation(summary = "Create Security Event", description = "Ingests a new security event into the analytics datastore")
    @PostMapping
    public ResponseEntity<SecurityEvent> createEvent(@Valid @RequestBody SecurityEvent event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(event));
    }
}
