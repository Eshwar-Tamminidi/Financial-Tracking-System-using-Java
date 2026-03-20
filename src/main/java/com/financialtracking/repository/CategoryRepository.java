package com.financialtracking.repository;

import com.financialtracking.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
    List<Category> findByUserIdAndType(Long userId, String type);
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    Optional<Category> findByNameAndUserId(String name, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
}
