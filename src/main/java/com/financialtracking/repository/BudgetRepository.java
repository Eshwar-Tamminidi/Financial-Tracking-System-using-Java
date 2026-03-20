package com.financialtracking.repository;

import com.financialtracking.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);

    List<Budget> findByUserIdAndActiveTrue(Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    List<Budget> findByUserIdAndCategoryId(Long userId, Long categoryId);

    void deleteByIdAndUserId(Long id, Long userId);
}
