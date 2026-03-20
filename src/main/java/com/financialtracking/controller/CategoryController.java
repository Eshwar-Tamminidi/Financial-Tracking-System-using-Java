package com.financialtracking.controller;

import com.financialtracking.dto.CategoryDTO;
import com.financialtracking.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(
            @RequestParam Long userId,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO createdCategory = categoryService.createCategory(userId, categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories(@RequestParam Long userId) {
        List<CategoryDTO> categories = categoryService.getAllCategoriesByUser(userId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByType(
            @RequestParam Long userId,
            @PathVariable String type) {
        List<CategoryDTO> categories = categoryService.getCategoriesByType(userId, type);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> getCategory(
            @RequestParam Long userId,
            @PathVariable Long categoryId) {
        CategoryDTO category = categoryService.getCategoryById(userId, categoryId);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @RequestParam Long userId,
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(userId, categoryId, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @RequestParam Long userId,
            @PathVariable Long categoryId) {
        boolean deleted = categoryService.deleteCategory(userId, categoryId);
        if (deleted) {
            return ResponseEntity.ok("Category deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
    }
}
