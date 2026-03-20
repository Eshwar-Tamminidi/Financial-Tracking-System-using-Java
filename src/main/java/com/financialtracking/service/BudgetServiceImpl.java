package com.financialtracking.service;

import com.financialtracking.dto.BudgetDTO;
import com.financialtracking.model.Budget;
import com.financialtracking.model.Category;
import com.financialtracking.model.User;
import com.financialtracking.repository.BudgetRepository;
import com.financialtracking.repository.CategoryRepository;
import com.financialtracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class BudgetServiceImpl implements BudgetService {
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public BudgetDTO createBudget(Long userId, BudgetDTO budgetDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = null;
        if (budgetDTO.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUserId(budgetDTO.getCategoryId(), userId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Budget budget = Budget.builder()
                .name(budgetDTO.getName())
                .limitAmount(budgetDTO.getLimitAmount())
                .spentAmount(budgetDTO.getSpentAmount() != null ? budgetDTO.getSpentAmount() : java.math.BigDecimal.ZERO)
                .period(budgetDTO.getPeriod())
                .startDate(budgetDTO.getStartDate())
                .endDate(budgetDTO.getEndDate())
                .description(budgetDTO.getDescription())
                .alertThreshold(budgetDTO.getAlertThreshold())
                .active(true)
                .user(user)
                .category(category)
                .build();

        Budget savedBudget = budgetRepository.save(budget);
        return convertToDTO(savedBudget);
    }

    @Override
    public BudgetDTO getBudgetById(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return convertToDTO(budget);
    }

    @Override
    public List<BudgetDTO> getAllBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BudgetDTO> getActiveBudgetsByUser(Long userId) {
        return budgetRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetDTO updateBudget(Long userId, Long budgetId, BudgetDTO budgetDTO) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (budgetDTO.getName() != null) {
            budget.setName(budgetDTO.getName());
        }
        if (budgetDTO.getLimitAmount() != null) {
            budget.setLimitAmount(budgetDTO.getLimitAmount());
        }
        if (budgetDTO.getSpentAmount() != null) {
            budget.setSpentAmount(budgetDTO.getSpentAmount());
        }
        if (budgetDTO.getDescription() != null) {
            budget.setDescription(budgetDTO.getDescription());
        }

        Budget updatedBudget = budgetRepository.save(budget);
        return convertToDTO(updatedBudget);
    }

    @Override
    public boolean deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
        return true;
    }

    private BudgetDTO convertToDTO(Budget budget) {
        return BudgetDTO.builder()
                .id(budget.getId())
                .name(budget.getName())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(budget.getSpentAmount())
                .period(budget.getPeriod())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .description(budget.getDescription())
                .active(budget.getActive())
                .alertThreshold(budget.getAlertThreshold())
                .categoryId(budget.getCategory() != null ? budget.getCategory().getId() : null)
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}
