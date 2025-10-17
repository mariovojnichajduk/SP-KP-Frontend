import { useNavigate } from 'react-router-dom';
import type { Listing } from '../types/listing';
import '../styles/ListingCard.css';

interface ListingCardProps {
  listing: Listing;
  showEditButton?: boolean;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
}

const ListingCard = ({ listing, showEditButton = false, onEdit, onDelete }: ListingCardProps) => {
  const navigate = useNavigate();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').toUpperCase();
  };

  const getImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      // Use mediumUrl if available, otherwise use main url
      return listing.images[0].mediumUrl || listing.images[0].url;
    }
    return null;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(listing.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(listing.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      {showEditButton && (
        <div className="listing-actions">
          <button
            className="edit-listing-button"
            onClick={handleEdit}
            aria-label="Edit listing"
          >
            Edit
          </button>
          {onDelete && (
            <button
              className="delete-listing-button"
              onClick={handleDelete}
              aria-label="Delete listing"
            >
              Delete
            </button>
          )}
        </div>
      )}
      <div className="listing-image-container">
        {getImageUrl() ? (
          <img
            src={getImageUrl()!}
            alt={listing.title}
            className="listing-image"
          />
        ) : (
          <div className="listing-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        <span className="listing-price-badge">{formatPrice(listing.price)}</span>
      </div>

      <div className="listing-details">
        <h3 className="listing-title">{listing.title}</h3>

        <p className="listing-description">
          {listing.description.length > 120
            ? `${listing.description.substring(0, 120)}...`
            : listing.description}
        </p>

        <div className="listing-meta">
          {listing.category && (
            <span className="listing-category">{listing.category.name}</span>
          )}
          <span className="listing-condition">{formatCondition(listing.condition)}</span>
        </div>

        {listing.location && (
          <div className="listing-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {listing.location}
          </div>
        )}

        <div className="listing-footer">
          {listing.user ? (
            <span className="listing-seller">
              {listing.user.firstName} {listing.user.lastName}
            </span>
          ) : (
            <span className="listing-seller">Anonymous</span>
          )}
          <span className="listing-views">{listing.views} views</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
