import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { listingsApi } from '../api/listingsApi';
import type { Listing } from '../types/listing';
import { toast } from 'react-toastify';
import '../styles/ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      fetchListing(id);
    }
  }, [id]);

  const fetchListing = async (listingId: string) => {
    try {
      setLoading(true);
      const data = await listingsApi.getOne(listingId);
      setListing(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to load listing';
      toast.error(errorMessage);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Placeholder
  };

  const handleFilterClick = () => {
    toast.info('Filter feature coming soon!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nextImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="listing-detail-page">
        <Header onSearch={handleSearch} onFilterClick={handleFilterClick} />
        <main className="listing-detail-content">
          <div className="listing-detail-container">
            <p style={{ textAlign: 'center', padding: '40px' }}>
              Loading listing...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="listing-detail-page">
        <Header onSearch={handleSearch} onFilterClick={handleFilterClick} />
        <main className="listing-detail-content">
          <div className="listing-detail-container">
            <p style={{ textAlign: 'center', padding: '40px' }}>
              Listing not found
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="listing-detail-page">
      <Header onSearch={handleSearch} onFilterClick={handleFilterClick} />

      <main className="listing-detail-content">
        <div className="listing-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>

          <div className="listing-detail-grid">
            <div className="listing-detail-images">
              {listing.images && listing.images.length > 0 ? (
                <div className="image-gallery">
                  <div className="main-image-container">
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                      className="main-image"
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          className="image-nav-button prev"
                          onClick={prevImage}
                          aria-label="Previous image"
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
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
                        <button
                          className="image-nav-button next"
                          onClick={nextImage}
                          aria-label="Next image"
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
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  {listing.images.length > 1 && (
                    <div className="image-thumbnails">
                      {listing.images.map((image, index) => (
                        <button
                          key={index}
                          className={`thumbnail ${
                            index === currentImageIndex ? 'active' : ''
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={image} alt={`Thumbnail ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-image-placeholder">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="listing-detail-info">
              <div className="listing-detail-header">
                <h1 className="listing-detail-title">{listing.title}</h1>
                <div className="listing-detail-price">
                  {formatPrice(listing.price)}
                </div>
              </div>

              <div className="listing-detail-meta">
                {listing.category && (
                  <span className="meta-badge category">
                    {listing.category.name}
                  </span>
                )}
                <span className="meta-badge condition">
                  {formatCondition(listing.condition)}
                </span>
                <span className="meta-badge status">{listing.status}</span>
              </div>

              <div className="listing-detail-description">
                <h2>Description</h2>
                <p>{listing.description}</p>
              </div>

              {listing.location && (
                <div className="listing-detail-location">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {listing.location}
                </div>
              )}

              <div className="listing-detail-seller">
                <h3>Seller Information</h3>
                {listing.user ? (
                  <div className="seller-info">
                    <div className="seller-avatar">
                      {listing.user.firstName[0]}
                      {listing.user.lastName[0]}
                    </div>
                    <div className="seller-details">
                      <p className="seller-name">
                        {listing.user.firstName} {listing.user.lastName}
                      </p>
                      <p className="seller-email">{listing.user.email}</p>
                    </div>
                  </div>
                ) : (
                  <p>Anonymous Seller</p>
                )}
              </div>

              <div className="listing-detail-footer">
                <div className="listing-stats">
                  <span className="stat">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    {listing.views} views
                  </span>
                  <span className="stat">
                    Posted on {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetail;
