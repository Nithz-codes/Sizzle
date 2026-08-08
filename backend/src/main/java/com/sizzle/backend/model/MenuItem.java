package com.sizzle.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 1000)
    private String image;

    @Column(nullable = false)
    private Boolean isVeg = true;

    @Column
    private Integer spicyLevel = 0; // 0: None, 1: Mild, 2: Medium, 3: Spicy

    @Column(length = 50)
    private String prepTime;

    @Column
    private Double rating = 4.5;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public MenuItem() {}

    public MenuItem(Long id, String name, String description, BigDecimal price, String image, Boolean isVeg, Integer spicyLevel, String prepTime, Double rating, Boolean isAvailable, Category category, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.isVeg = isVeg != null ? isVeg : true;
        this.spicyLevel = spicyLevel != null ? spicyLevel : 0;
        this.prepTime = prepTime;
        this.rating = rating != null ? rating : 4.5;
        this.isAvailable = isAvailable != null ? isAvailable : true;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isVeg == null) this.isVeg = true;
        if (this.spicyLevel == null) this.spicyLevel = 0;
        if (this.rating == null) this.rating = 4.5;
        if (this.isAvailable == null) this.isAvailable = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }

    public Integer getSpicyLevel() { return spicyLevel; }
    public void setSpicyLevel(Integer spicyLevel) { this.spicyLevel = spicyLevel; }

    public String getPrepTime() { return prepTime; }
    public void setPrepTime(String prepTime) { this.prepTime = prepTime; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static MenuItemBuilder builder() {
        return new MenuItemBuilder();
    }

    public static class MenuItemBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String image;
        private Boolean isVeg;
        private Integer spicyLevel;
        private String prepTime;
        private Double rating;
        private Boolean isAvailable;
        private Category category;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public MenuItemBuilder id(Long id) { this.id = id; return this; }
        public MenuItemBuilder name(String name) { this.name = name; return this; }
        public MenuItemBuilder description(String description) { this.description = description; return this; }
        public MenuItemBuilder price(BigDecimal price) { this.price = price; return this; }
        public MenuItemBuilder image(String image) { this.image = image; return this; }
        public MenuItemBuilder isVeg(Boolean isVeg) { this.isVeg = isVeg; return this; }
        public MenuItemBuilder spicyLevel(Integer spicyLevel) { this.spicyLevel = spicyLevel; return this; }
        public MenuItemBuilder prepTime(String prepTime) { this.prepTime = prepTime; return this; }
        public MenuItemBuilder rating(Double rating) { this.rating = rating; return this; }
        public MenuItemBuilder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public MenuItemBuilder category(Category category) { this.category = category; return this; }
        public MenuItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public MenuItemBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public MenuItem build() {
            return new MenuItem(id, name, description, price, image, isVeg, spicyLevel, prepTime, rating, isAvailable, category, createdAt, updatedAt);
        }
    }
}
