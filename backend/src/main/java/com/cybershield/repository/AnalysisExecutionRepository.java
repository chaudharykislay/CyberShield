package com.cybershield.repository;

import com.cybershield.model.AnalysisExecution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisExecutionRepository extends JpaRepository<AnalysisExecution, Long> {
    Optional<AnalysisExecution> findByExecutionId(String executionId);

    Page<AnalysisExecution> findByAlgorithmId(String algorithmId, Pageable pageable);

    Page<AnalysisExecution> findByStatus(String status, Pageable pageable);

    Page<AnalysisExecution> findByAlgorithmIdAndStatus(String algorithmId, String status, Pageable pageable);

    List<AnalysisExecution> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT a.module, COUNT(a), AVG(a.executionTimeNanos) FROM AnalysisExecution a GROUP BY a.module")
    List<Object[]> findModuleStats();
}
