package com.cybershield.repository;

import com.cybershield.model.AnalysisFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisFindingRepository extends JpaRepository<AnalysisFinding, Long> {
    List<AnalysisFinding> findByExecutionId(String executionId);
}
