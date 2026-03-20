package com.financialtracking.controller;

import com.financialtracking.dto.TransactionDTO;
import com.financialtracking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @RequestParam Long userId,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO createdTransaction = transactionService.createTransaction(userId, transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(@RequestParam Long userId) {
        List<TransactionDTO> transactions = transactionService.getAllTransactionsByUser(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByType(
            @RequestParam Long userId,
            @PathVariable String type) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByType(userId, type);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccount(
            @RequestParam Long userId,
            @PathVariable Long accountId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByAccount(userId, accountId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCategory(
            @RequestParam Long userId,
            @PathVariable Long categoryId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCategory(userId, categoryId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByDateRange(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, java.math.BigDecimal>> getFinancialSummary(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, java.math.BigDecimal> summary = transactionService.getFinancialSummary(userId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDTO> getTransaction(
            @RequestParam Long userId,
            @PathVariable Long transactionId) {
        TransactionDTO transaction = transactionService.getTransactionById(userId, transactionId);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @RequestParam Long userId,
            @PathVariable Long transactionId,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO updatedTransaction = transactionService.updateTransaction(userId, transactionId, transactionDTO);
        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteTransaction(
            @RequestParam Long userId,
            @PathVariable Long transactionId) {
        boolean deleted = transactionService.deleteTransaction(userId, transactionId);
        if (deleted) {
            return ResponseEntity.ok("Transaction deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
    }
}
