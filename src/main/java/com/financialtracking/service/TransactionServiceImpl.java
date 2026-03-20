package com.financialtracking.service;

import com.financialtracking.dto.TransactionDTO;
import com.financialtracking.model.Account;
import com.financialtracking.model.Category;
import com.financialtracking.model.Transaction;
import com.financialtracking.model.User;
import com.financialtracking.repository.AccountRepository;
import com.financialtracking.repository.CategoryRepository;
import com.financialtracking.repository.TransactionRepository;
import com.financialtracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public TransactionDTO createTransaction(Long userId, TransactionDTO transactionDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByIdAndUserId(transactionDTO.getAccountId(), userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Category category = categoryRepository.findByIdAndUserId(transactionDTO.getCategoryId(), userId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Update balance based on transaction type
        if ("EXPENSE".equals(transactionDTO.getType())) {
            account.setBalance(account.getBalance().subtract(transactionDTO.getAmount()));
        } else if ("INCOME".equals(transactionDTO.getType())) {
            account.setBalance(account.getBalance().add(transactionDTO.getAmount()));
        }

        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .title(transactionDTO.getTitle())
                .description(transactionDTO.getDescription())
                .amount(transactionDTO.getAmount())
                .type(transactionDTO.getType())
                .transactionDate(transactionDTO.getTransactionDate())
                .paymentMethod(transactionDTO.getPaymentMethod())
                .isRecurring(transactionDTO.getIsRecurring() != null ? transactionDTO.getIsRecurring() : false)
                .recurringFrequency(transactionDTO.getRecurringFrequency())
                .notes(transactionDTO.getNotes())
                .user(user)
                .account(account)
                .category(category)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    @Override
    public TransactionDTO getTransactionById(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDTO(transaction);
    }

    @Override
    public List<TransactionDTO> getAllTransactionsByUser(Long userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByType(Long userId, String type) {
        return transactionRepository.findByUserIdAndType(userId, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByAccount(Long userId, Long accountId) {
        return transactionRepository.findByUserIdAndAccountId(userId, accountId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByCategory(Long userId, Long categoryId) {
        return transactionRepository.findByUserIdAndCategoryId(userId, categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDTO updateTransaction(Long userId, Long transactionId, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transactionDTO.getTitle() != null) {
            transaction.setTitle(transactionDTO.getTitle());
        }
        if (transactionDTO.getDescription() != null) {
            transaction.setDescription(transactionDTO.getDescription());
        }
        if (transactionDTO.getAmount() != null) {
            transaction.setAmount(transactionDTO.getAmount());
        }
        if (transactionDTO.getPaymentMethod() != null) {
            transaction.setPaymentMethod(transactionDTO.getPaymentMethod());
        }

        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    @Override
    public boolean deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Reverse the balance update
        Account account = transaction.getAccount();
        if ("EXPENSE".equals(transaction.getType())) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else if ("INCOME".equals(transaction.getType())) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }
        accountRepository.save(account);

        transactionRepository.delete(transaction);
        return true;
    }

    @Override
    public Map<String, BigDecimal> getFinancialSummary(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, BigDecimal> summary = new HashMap<>();

        BigDecimal totalIncome = transactionRepository.getTotalIncome(userId, startDate, endDate);
        BigDecimal totalExpense = transactionRepository.getTotalExpense(userId, startDate, endDate);

        summary.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        summary.put("totalExpense", totalExpense != null ? totalExpense : BigDecimal.ZERO);
        summary.put("net", (totalIncome != null ? totalIncome : BigDecimal.ZERO)
                .subtract(totalExpense != null ? totalExpense : BigDecimal.ZERO));

        return summary;
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .title(transaction.getTitle())
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .transactionDate(transaction.getTransactionDate())
                .paymentMethod(transaction.getPaymentMethod())
                .isRecurring(transaction.getIsRecurring())
                .recurringFrequency(transaction.getRecurringFrequency())
                .notes(transaction.getNotes())
                .accountId(transaction.getAccount().getId())
                .categoryId(transaction.getCategory().getId())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
