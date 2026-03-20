package com.financialtracking.service;

import com.financialtracking.dto.BudgetDTO;
import java.util.List;

public interface BudgetService {
    BudgetDTO createBudget(Long userId, BudgetDTO budgetDTO);
    BudgetDTO getBudgetById(Long userId, Long budgetId);
    List<BudgetDTO> getAllBudgetsByUser(Long userId);
    List<BudgetDTO> getActiveBudgetsByUser(Long userId);
    BudgetDTO updateBudget(Long userId, Long budgetId, BudgetDTO budgetDTO);
    boolean deleteBudget(Long userId, Long budgetId);
}
