package com.financialtracking.service;

import com.financialtracking.dto.CategoryDTO;
import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(Long userId, CategoryDTO categoryDTO);
    CategoryDTO getCategoryById(Long userId, Long categoryId);
    List<CategoryDTO> getAllCategoriesByUser(Long userId);
    List<CategoryDTO> getCategoriesByType(Long userId, String type);
    CategoryDTO updateCategory(Long userId, Long categoryId, CategoryDTO categoryDTO);
    boolean deleteCategory(Long userId, Long categoryId);
}
