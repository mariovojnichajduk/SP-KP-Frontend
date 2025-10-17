import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import { listingsApi } from '../api/listingsApi';
import type { CreateListingDto } from '../api/listingsApi';
import { categoriesApi } from '../api/categoriesApi';
import type { Category } from '../api/categoriesApi';
import type { ListingCondition } from '../types/listing';
import type { Image } from '../types/image';
import { toast } from 'react-toastify';
import '../styles/AddListing.css';

const AddListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    condition: '',
    categoryId: '',
    location: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll(false);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const submitData: CreateListingDto = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
      };

      if (formData.condition && formData.condition !== '')
        submitData.condition = formData.condition as ListingCondition;
      if (formData.categoryId && formData.categoryId !== '')
        submitData.categoryId = formData.categoryId;
      if (formData.location && formData.location !== '')
        submitData.location = formData.location;

      const createdListing = await listingsApi.create(submitData);
      setCreatedListingId(createdListing.id);
      toast.success('Listing created successfully! You can now upload images.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create listing';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-listings');
  };

  const handleFinish = () => {
    navigate('/my-listings');
  };

  const handleImagesChange = (newImages: Image[]) => {
    setImages(newImages);
  };

  const handleSearch = () => {
    // Placeholder
  };

  const handleFilterClick = () => {
    toast.info('Filter feature coming soon!');
  };

  return (
    <div className="add-listing-page">
      <Header onSearch={handleSearch} onFilterClick={handleFilterClick} />

      <main className="add-listing-content">
        <div className="add-listing-container">
          <h1 className="add-listing-title">Create New Listing</h1>

          {createdListingId && (
            <div className="success-banner">
              <p>Listing created successfully! Now you can upload images.</p>
              <button onClick={handleFinish} className="btn-finish">
                Finish & View My Listings
              </button>
            </div>
          )}

          {createdListingId && (
            <ImageUpload
              listingId={createdListingId}
              existingImages={images}
              onImagesChange={handleImagesChange}
              maxImages={10}
            />
          )}

          {!createdListingId && (
            <form onSubmit={handleSubmit} className="add-listing-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13 Pro Max"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your item in detail..."
                rows={6}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="condition" className="form-label">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Belgrade, Serbia"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddListing;
