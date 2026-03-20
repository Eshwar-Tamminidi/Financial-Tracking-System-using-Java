package com.financialtracking.service;

import com.financialtracking.dto.UserDTO;
import com.financialtracking.model.User;
import java.util.Optional;

public interface UserService {
    UserDTO registerUser(String username, String email, String password, String firstName, String lastName);
    UserDTO updateUser(Long userId, UserDTO userDTO);
    UserDTO getUserById(Long userId);
    UserDTO getUserByUsername(String username);
    boolean deleteUser(Long userId);
    Optional<User> findUserByUsernameOrEmail(String usernameOrEmail);
}
