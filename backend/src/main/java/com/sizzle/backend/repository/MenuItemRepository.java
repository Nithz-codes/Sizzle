package com.sizzle.backend.repository;

import com.sizzle.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    boolean existsByName(String name);

    Optional<MenuItem> findByName(String name);

    List<MenuItem> findByCategoryId(Long categoryId);

    List<MenuItem> findByIsAvailableTrue();

    List<MenuItem> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE " +
           "m.isAvailable = true AND " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY m.category.id ASC, m.id ASC")
    List<MenuItem> searchMenuItems(@Param("categoryId") Long categoryId, @Param("search") String search);

    long countByCategoryId(Long categoryId);
}
