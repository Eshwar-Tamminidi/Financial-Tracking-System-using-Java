package com.financialtracking.service;

import com.financialtracking.dto.TransactionDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface TransactionService {
    TransactionDTO createTransaction(Long userId, TransactionDTO transactionDTO);
    TransactionDTO getTransactionById(Long userId, Long transactionId);
    List<TransactionDTO> getAllTransactionsByUser(Long userId);
    List<TransactionDTO> getTransactionsByType(Long userId, String type);
    List<TransactionDTO> getTransactionsByAccount(Long userId, Long accountId);
    List<TransactionDTO> getTransactionsByCategory(Long userId, Long categoryId);
    List<TransactionDTO> getTransactionsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    TransactionDTO updateTransaction(Long userId, Long transactionId, TransactionDTO transactionDTO);
    boolean deleteTransaction(Long userId, Long transactionId);
    Map<String, BigDecimal> getFinancialSummary(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
