package com.financialtracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String message;
    private String token;
    private UserDTO user;
    private Boolean success;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class ResponseDTO {
    private String message;
    private Object data;
    private Boolean success;
}
