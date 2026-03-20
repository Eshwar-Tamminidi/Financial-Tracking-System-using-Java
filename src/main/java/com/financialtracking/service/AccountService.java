package com.financialtracking.service;

import com.financialtracking.dto.AccountDTO;
import java.util.List;

public interface AccountService {
    AccountDTO createAccount(Long userId, AccountDTO accountDTO);
    AccountDTO getAccountById(Long userId, Long accountId);
    List<AccountDTO> getAllAccountsByUser(Long userId);
    AccountDTO updateAccount(Long userId, Long accountId, AccountDTO accountDTO);
    boolean deleteAccount(Long userId, Long accountId);
}
