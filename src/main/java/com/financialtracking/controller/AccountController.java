package com.financialtracking.controller;

import com.financialtracking.dto.AccountDTO;
import com.financialtracking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(
            @RequestParam Long userId,
            @Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO createdAccount = accountService.createAccount(userId, accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts(@RequestParam Long userId) {
        List<AccountDTO> accounts = accountService.getAllAccountsByUser(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDTO> getAccount(
            @RequestParam Long userId,
            @PathVariable Long accountId) {
        AccountDTO account = accountService.getAccountById(userId, accountId);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<AccountDTO> updateAccount(
            @RequestParam Long userId,
            @PathVariable Long accountId,
            @Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO updatedAccount = accountService.updateAccount(userId, accountId, accountDTO);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(
            @RequestParam Long userId,
            @PathVariable Long accountId) {
        boolean deleted = accountService.deleteAccount(userId, accountId);
        if (deleted) {
            return ResponseEntity.ok("Account deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
    }
}
