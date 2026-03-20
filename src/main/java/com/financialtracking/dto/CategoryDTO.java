package com.financialtracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    @NotBlank(message = "Category type is required")
    private String type;

    private Boolean active;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
