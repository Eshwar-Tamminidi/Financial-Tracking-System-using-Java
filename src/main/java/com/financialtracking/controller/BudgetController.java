package com.financialtracking.controller;

import com.financialtracking.dto.BudgetDTO;
import com.financialtracking.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(
            @RequestParam Long userId,
            @Valid @RequestBody BudgetDTO budgetDTO) {
        BudgetDTO createdBudget = budgetService.createBudget(userId, budgetDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets(@RequestParam Long userId) {
        List<BudgetDTO> budgets = budgetService.getAllBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/active")
    public ResponseEntity<List<BudgetDTO>> getActiveBudgets(@RequestParam Long userId) {
        List<BudgetDTO> budgets = budgetService.getActiveBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{budgetId}")
    public ResponseEntity<BudgetDTO> getBudget(
            @RequestParam Long userId,
            @PathVariable Long budgetId) {
        BudgetDTO budget = budgetService.getBudgetById(userId, budgetId);
        return ResponseEntity.ok(budget);
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetDTO> updateBudget(
            @RequestParam Long userId,
            @PathVariable Long budgetId,
            @Valid @RequestBody BudgetDTO budgetDTO) {
        BudgetDTO updatedBudget = budgetService.updateBudget(userId, budgetId, budgetDTO);
        return ResponseEntity.ok(updatedBudget);
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<String> deleteBudget(
            @RequestParam Long userId,
            @PathVariable Long budgetId) {
        boolean deleted = budgetService.deleteBudget(userId, budgetId);
        if (deleted) {
            return ResponseEntity.ok("Budget deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Budget not found");
    }
}
