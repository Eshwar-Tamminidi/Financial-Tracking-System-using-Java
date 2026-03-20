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
public class TransactionDTO {
    private Long id;

    @NotBlank(message = "Transaction title is required")
    private String title;

    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotBlank(message = "Transaction type is required")
    private String type;

    @NotNull(message = "Transaction date is required")
    private LocalDateTime transactionDate;

    private String paymentMethod;
    private Boolean isRecurring;
    private String recurringFrequency;
    private String notes;
    private Long accountId;
    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
