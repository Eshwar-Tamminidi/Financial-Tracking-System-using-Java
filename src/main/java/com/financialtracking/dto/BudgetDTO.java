package com.financialtracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetDTO {
    private Long id;

    @NotBlank(message = "Budget name is required")
    private String name;

    @NotNull(message = "Limit amount is required")
    @DecimalMin("0.01")
    private BigDecimal limitAmount;

    @DecimalMin("0.00")
    private BigDecimal spentAmount;

    @NotBlank(message = "Period is required")
    private String period;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private String description;
    private Boolean active;
    private String alertThreshold;
    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
