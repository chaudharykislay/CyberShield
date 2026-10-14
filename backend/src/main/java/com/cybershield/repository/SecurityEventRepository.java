package com.cybershield.repository;

import com.cybershield.model.SecurityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
    Optional<SecurityEvent> findByEventId(String eventId);

    Page<SecurityEvent> findByType(String type, Pageable pageable);

    Page<SecurityEvent> findBySeverity(String severity, Pageable pageable);

    Page<SecurityEvent> findByTypeAndSeverity(String type, String severity, Pageable pageable);
}
