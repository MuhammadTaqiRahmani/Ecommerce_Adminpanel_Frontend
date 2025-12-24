// Category Entity
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  parent_id: string | null;
  parent: Category | null;
  children: Category[];
  product_count: number;
  created_at: string;
  updated_at: string;
}

// Category Request Types
export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  parent_id?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

// Category Tree Node (for tree view)
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  level: number;
}

// Category Filters
export interface CategoryFilters {
  is_active?: boolean;
  parent_id?: string | null;
  search?: string;
}

// Build category tree from flat list
export function buildCategoryTree(categories: Category[], parentId: string | null = null, level: number = 0): CategoryTreeNode[] {
  return categories
    .filter(cat => cat.parent_id === parentId)
    .map(cat => ({
      ...cat,
      level,
      children: buildCategoryTree(categories, cat.id, level + 1),
    }));
}

// Flatten category tree for select options
export function flattenCategoryTree(categories: Category[], level: number = 0): Array<Category & { level: number }> {
  const result: Array<Category & { level: number }> = [];
  
  for (const cat of categories) {
    result.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategoryTree(cat.children, level + 1));
    }
  }
  
  return result;
}
