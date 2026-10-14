package com.cybershield.repository;

import com.cybershield.model.ThreatSignature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatSignatureRepository extends JpaRepository<ThreatSignature, Long> {
    Optional<ThreatSignature> findBySignatureId(String signatureId);

    List<ThreatSignature> findByCategory(String category);

    Page<ThreatSignature> findByCategory(String category, Pageable pageable);
}
