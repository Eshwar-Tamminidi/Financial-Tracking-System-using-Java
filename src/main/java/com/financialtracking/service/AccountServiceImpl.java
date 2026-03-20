package com.financialtracking.service;

import com.financialtracking.dto.AccountDTO;
import com.financialtracking.model.Account;
import com.financialtracking.model.User;
import com.financialtracking.repository.AccountRepository;
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
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public AccountDTO createAccount(Long userId, AccountDTO accountDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = Account.builder()
                .accountName(accountDTO.getAccountName())
                .accountType(accountDTO.getAccountType())
                .balance(accountDTO.getBalance())
                .initialBalance(accountDTO.getInitialBalance())
                .accountLimit(accountDTO.getAccountLimit())
                .description(accountDTO.getDescription())
                .active(true)
                .user(user)
                .build();

        Account savedAccount = accountRepository.save(account);
        return convertToDTO(savedAccount);
    }

    @Override
    public AccountDTO getAccountById(Long userId, Long accountId) {
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return convertToDTO(account);
    }

    @Override
    public List<AccountDTO> getAllAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO updateAccount(Long userId, Long accountId, AccountDTO accountDTO) {
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (accountDTO.getAccountName() != null) {
            account.setAccountName(accountDTO.getAccountName());
        }
        if (accountDTO.getBalance() != null) {
            account.setBalance(accountDTO.getBalance());
        }
        if (accountDTO.getAccountLimit() != null) {
            account.setAccountLimit(accountDTO.getAccountLimit());
        }
        if (accountDTO.getDescription() != null) {
            account.setDescription(accountDTO.getDescription());
        }

        Account updatedAccount = accountRepository.save(account);
        return convertToDTO(updatedAccount);
    }

    @Override
    public boolean deleteAccount(Long userId, Long accountId) {
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
        return true;
    }

    private AccountDTO convertToDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .initialBalance(account.getInitialBalance())
                .accountLimit(account.getAccountLimit())
                .description(account.getDescription())
                .active(account.getActive())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
