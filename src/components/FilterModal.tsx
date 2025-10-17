import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categoriesApi';
import type { Category } from '../api/categoriesApi';
import type { ListingCondition } from '../types/listing';
import '../styles/FilterModal.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export interface FilterOptions {
  categoryId?: string;
  condition?: ListingCondition | '';
  minPrice?: number;
  maxPrice?: number;
}

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    categoryId: currentFilters?.categoryId || '',
    condition: currentFilters?.condition || '',
    minPrice: currentFilters?.minPrice,
    maxPrice: currentFilters?.maxPrice,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll(false);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const handleApply = () => {
    const appliedFilters: FilterOptions = {};
    if (filters.categoryId) appliedFilters.categoryId = filters.categoryId;
    if (filters.condition) appliedFilters.condition = filters.condition as ListingCondition;
    if (filters.minPrice !== undefined && filters.minPrice !== null) appliedFilters.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) appliedFilters.maxPrice = filters.maxPrice;

    onApply(appliedFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      categoryId: '',
      condition: '',
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setFilters(prev => ({ ...prev, [field]: numValue }));
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h2>Filter Listings</h2>
          <button className="filter-modal-close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.categoryId || ''}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              value={filters.condition || ''}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value as ListingCondition | '' })}
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <div className="price-input">
                <label htmlFor="minPrice">Min</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={filters.minPrice ?? ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input">
                <label htmlFor="maxPrice">Max</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Any"
                  min="0"
                  step="1"
                  value={filters.maxPrice ?? ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button className="filter-reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="filter-apply-button" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
