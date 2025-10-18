import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Header from '../components/Header';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { usersApi } from '../api/usersApi';
import { toast } from 'react-toastify';
import '../styles/Profile.css';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getProfile();
      const profileData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
      };
      setFormData(profileData);
      setOriginalData(profileData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phone !== originalData.phone
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast.info('No changes to save');
      return;
    }

    try {
      setSaving(true);
      const updateData: UpdateUserData = {};

      if (formData.firstName !== originalData.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName !== originalData.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.phone !== originalData.phone) {
        updateData.phone = formData.phone;
      }

      const updatedUser = await usersApi.updateProfile(updateData);
      const newProfileData = {
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        phone: updatedUser.phone || '',
      };
      setFormData(newProfileData);
      setOriginalData(newProfileData);
      toast.success('Profile updated successfully!');

      // Redirect to home page after successful save
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-content">
          <div className="profile-container">
            <p className="loading-text">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <div className="profile-container">
          <button className="back-button" onClick={() => navigate('/home')}>
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
            Back to Home
          </button>

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {formData.firstName?.[0]?.toUpperCase() || 'U'}
                {formData.lastName?.[0]?.toUpperCase() || ''}
              </div>
              <div className="profile-info">
                <h1 className="profile-title">Profile Settings</h1>
                <p className="profile-email">{user?.email}</p>
              </div>
              <button
                type="button"
                className="btn-change-password"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </button>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+1234567890"
                  pattern="^\+?[1-9]\d{1,14}$"
                  title="Please enter a valid phone number in international format (e.g., +1234567890)"
                />
                <small className="form-hint">
                  Optional. Use international format (e.g., +1234567890)
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-cancel"
                  disabled={!hasChanges() || saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={!hasChanges() || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Profile;
