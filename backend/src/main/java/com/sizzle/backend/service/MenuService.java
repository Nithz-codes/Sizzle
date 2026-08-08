package com.sizzle.backend.service;

import com.sizzle.backend.dto.CategoryResponse;
import com.sizzle.backend.dto.CreateMenuItemRequest;
import com.sizzle.backend.dto.MenuItemResponse;
import com.sizzle.backend.dto.UpdateMenuItemRequest;

import java.util.List;

public interface MenuService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);

    List<MenuItemResponse> getMenuItems(Long categoryId, String search);
    MenuItemResponse getMenuItemById(Long id);

    MenuItemResponse createMenuItem(CreateMenuItemRequest request);
    MenuItemResponse updateMenuItem(Long id, UpdateMenuItemRequest request);
    void deleteMenuItem(Long id);
}
