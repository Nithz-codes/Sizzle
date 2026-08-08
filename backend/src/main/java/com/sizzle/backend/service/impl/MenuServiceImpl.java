package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.CategoryResponse;
import com.sizzle.backend.dto.CreateMenuItemRequest;
import com.sizzle.backend.dto.MenuItemResponse;
import com.sizzle.backend.dto.UpdateMenuItemRequest;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.Category;
import com.sizzle.backend.model.MenuItem;
import com.sizzle.backend.repository.CategoryRepository;
import com.sizzle.backend.repository.MenuItemRepository;
import com.sizzle.backend.service.MenuService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuServiceImpl(CategoryRepository categoryRepository, MenuItemRepository menuItemRepository) {
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToCategoryResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItems(Long categoryId, String search) {
        List<MenuItem> items = menuItemRepository.searchMenuItems(categoryId, search);
        return items.stream()
                .map(this::mapToMenuItemResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return mapToMenuItemResponse(menuItem);
    }

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(CreateMenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .image(request.getImage())
                .isVeg(request.getIsVeg())
                .spicyLevel(request.getSpicyLevel())
                .prepTime(request.getPrepTime())
                .rating(request.getRating())
                .isAvailable(request.getIsAvailable())
                .category(category)
                .build();

        MenuItem savedItem = menuItemRepository.save(menuItem);
        return mapToMenuItemResponse(savedItem);
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(Long id, UpdateMenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            menuItem.setCategory(category);
        }

        if (request.getName() != null) menuItem.setName(request.getName());
        if (request.getDescription() != null) menuItem.setDescription(request.getDescription());
        if (request.getPrice() != null) menuItem.setPrice(request.getPrice());
        if (request.getImage() != null) menuItem.setImage(request.getImage());
        if (request.getIsVeg() != null) menuItem.setIsVeg(request.getIsVeg());
        if (request.getSpicyLevel() != null) menuItem.setSpicyLevel(request.getSpicyLevel());
        if (request.getPrepTime() != null) menuItem.setPrepTime(request.getPrepTime());
        if (request.getRating() != null) menuItem.setRating(request.getRating());
        if (request.getIsAvailable() != null) menuItem.setIsAvailable(request.getIsAvailable());

        MenuItem updatedItem = menuItemRepository.save(menuItem);
        return mapToMenuItemResponse(updatedItem);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        long itemCount = menuItemRepository.countByCategoryId(category.getId());
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDisplayName(),
                category.getIcon(),
                category.getDescription(),
                itemCount
        );
    }

    private MenuItemResponse mapToMenuItemResponse(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getImage(),
                menuItem.getIsVeg(),
                menuItem.getSpicyLevel(),
                menuItem.getPrepTime(),
                menuItem.getRating(),
                menuItem.getIsAvailable(),
                menuItem.getCategory().getId(),
                menuItem.getCategory().getName()
        );
    }
}
