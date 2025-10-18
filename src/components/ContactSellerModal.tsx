import { useState } from 'react';
import { listingsApi } from '../api/listingsApi';
import { toast } from 'react-toastify';
import '../styles/ContactSellerModal.css';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  listingTitle: string;
  listingId: string;
}

const ContactSellerModal = ({
  isOpen,
  onClose,
  sellerName,
  listingTitle,
  listingId,
}: ContactSellerModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSending(true);
      await listingsApi.contactSeller(listingId, {
        name,
        email,
        phone,
        message,
      });
      toast.success('Message sent successfully to the seller!');
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact Seller</h2>
          <button className="modal-close-button" onClick={handleClose}>
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

        <div className="modal-body">
          <div className="modal-info">
            <p className="modal-seller">
              <strong>Seller:</strong> {sellerName}
            </p>
            <p className="modal-listing">
              <strong>Regarding:</strong> {listingTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Your Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number (optional)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message to the seller..."
                required
                rows={5}
                className="form-textarea"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={handleClose}
                className="btn-cancel"
                disabled={sending}
              >
                Cancel
              </button>
              <button type="submit" className="btn-send" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerModal;
