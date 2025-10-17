import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import FilterModal from '../components/FilterModal';
import type { FilterOptions } from '../components/FilterModal';
import { listingsApi } from '../api/listingsApi';
import type { Listing } from '../types/listing';
import { toast } from 'react-toastify';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [myListingIds, setMyListingIds] = useState<string[]>([]);

  useEffect(() => {
    fetchListings();
    fetchMyListingIds();
  }, []);

  const fetchListings = async (search?: string, filters?: FilterOptions) => {
    try {
      setLoading(true);
      const apiFilters: any = { status: 'active' };
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
        error.response?.data?.message || 'Failed to load listings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchListings(query, activeFilters);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    fetchListings(searchQuery, filters);
  };

  const fetchMyListingIds = async () => {
    try {
      const ids = await listingsApi.getMyListingIds();
      setMyListingIds(ids);
    } catch (error: any) {
      console.error('Failed to fetch user listing IDs', error);
    }
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
      // Remove from myListingIds as well
      setMyListingIds((prevIds) => prevIds.filter((id) => id !== listingId));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete listing';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} onFilterClick={handleFilterClick} showFilter={true} showSearch={true} />

      <main className="home-content">
        <div className="home-container">
          <h1 className="home-title">All Listings</h1>

          {loading ? (
            <div className="loading-container">
              <p>Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <p>No listings available at the moment.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => {
                const isMyListing = myListingIds.includes(listing.id);
                return (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    showEditButton={isMyListing}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                  />
                );
              })}
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

export default Home;
