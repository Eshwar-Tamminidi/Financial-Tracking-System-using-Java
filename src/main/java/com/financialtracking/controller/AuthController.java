package com.financialtracking.controller;

import com.financialtracking.dto.AuthResponseDTO;
import com.financialtracking.dto.UserDTO;
import com.financialtracking.model.User;
import com.financialtracking.service.JwtTokenProvider;
import com.financialtracking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            UserDTO userDTO = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AuthResponseDTO.builder()
                            .message("User registered successfully")
                            .user(userDTO)
                            .success(true)
                            .build());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponseDTO.builder()
                            .message(ex.getMessage())
                            .success(false)
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<User> user = userService.findUserByUsernameOrEmail(request.getUsernameOrEmail());
            
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(AuthResponseDTO.builder()
                                .message("Invalid credentials")
                                .success(false)
                                .build());
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.get().getUsername(),
                            request.getPassword()
                    )
            );

            String token = jwtTokenProvider.generateToken(user.get());
            UserDTO userDTO = UserDTO.builder()
                    .id(user.get().getId())
                    .username(user.get().getUsername())
                    .email(user.get().getEmail())
                    .firstName(user.get().getFirstName())
                    .lastName(user.get().getLastName())
                    .profilePicture(user.get().getProfilePicture())
                    .build();

            return ResponseEntity.ok(AuthResponseDTO.builder()
                    .message("Login successful")
                    .token(token)
                    .user(userDTO)
                    .success(true)
                    .build());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponseDTO.builder()
                            .message("Invalid credentials")
                            .success(false)
                            .build());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            return ResponseEntity.ok(jwtTokenProvider.validateToken(jwt));
        }
        return ResponseEntity.ok(false);
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;

        public RegisterRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }

    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;

        public LoginRequest() {}

        public String getUsernameOrEmail() { return usernameOrEmail; }
        public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
