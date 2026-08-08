package com.sizzle.backend.dto;

public class CategoryResponse {
    private Long id;
    private String name;
    private String displayName;
    private String icon;
    private String description;
    private long itemCount;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String displayName, String icon, String description, long itemCount) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.icon = icon;
        this.description = description;
        this.itemCount = itemCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public long getItemCount() { return itemCount; }
    public void setItemCount(long itemCount) { this.itemCount = itemCount; }
}
