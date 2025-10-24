import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import FilterModal from '../components/FilterModal';
import type { FilterOptions } from '../components/FilterModal';
import { listingsApi } from '../api/listingsApi';
import { useAppSelector } from '../store/hooks';
import type { Listing } from '../types/listing';
import { toast } from 'react-toastify';
import '../styles/MyListings.css';

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async (search?: string, filters?: FilterOptions) => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('User not found');
        return;
      }
      const apiFilters: any = { userId: user.id };
      if (search) {
        apiFilters.search = search;
      }
      if (filters?.categoryId) {
        apiFilters.categoryId = filters.categoryId;
      }
      if (filters?.condition) {
        apiFilters.condition = filters.condition;
      }
      if (filters?.minPrice !== undefined) {
        apiFilters.minPrice = filters.minPrice;
      }
      if (filters?.maxPrice !== undefined) {
        apiFilters.maxPrice = filters.maxPrice;
      }
      const data = await listingsApi.getAll(apiFilters);
      setListings(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to load your listings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchMyListings(query, activeFilters);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    fetchMyListings(searchQuery, filters);
  };

  const handleAddListing = () => {
    navigate('/add-listing');
  };

  const handleEditListing = (listingId: string) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsApi.delete(listingId);
      toast.success('Listing deleted successfully!');
      // Remove the deleted listing from the state
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== listingId)
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete listing';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="my-listings-page">
      <Header onSearch={handleSearch} onFilterClick={handleFilterClick} showFilter={true} showSearch={true} />

      <main className="my-listings-content">
        <div className="my-listings-container">
          <div className="my-listings-header">
            <h1 className="my-listings-title">My Listings</h1>
            <button
              className={`add-listing-button ${listings.length === 0 && !loading ? 'hidden' : ''}`}
              onClick={handleAddListing}
              aria-label="Add Listing"
            >
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <p>Loading your listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any listings yet.</p>
              <button className="create-first-button" onClick={handleAddListing}>
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  showEditButton={true}
                  onEdit={handleEditListing}
                  onDelete={handleDeleteListing}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default MyListings;
