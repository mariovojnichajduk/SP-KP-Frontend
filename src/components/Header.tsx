import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import '../styles/Header.css';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
  showSearch?: boolean;
}

const Header = ({ onSearch, onFilterClick, showFilter = false, showSearch = false }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <button
          className="hamburger-button hamburger-left"
          onClick={toggleMenu}
          aria-label="Menu"
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
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        <div className="header-left desktop-only-logo">
          <img
            src="https://i.postimg.cc/gkJD38Lv/logo.png"
            alt="StudioPresent Logo"
            className="header-logo"
            onClick={() => navigate('/home')}
          />
        </div>

        {showSearch && (
          <div className="header-center">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
              {showFilter && (
                <button
                  type="button"
                  onClick={onFilterClick}
                  className="filter-button"
                  aria-label="Filter"
                >
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
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                </button>
              )}
            </form>
          </div>
        )}

        <button
          className="hamburger-button hamburger-right"
          onClick={toggleMenu}
          aria-label="Menu"
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
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        <nav className="header-right desktop-nav">
          <button
            className="nav-button"
            onClick={() => navigate('/my-listings')}
          >
            My Listings
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img
            src="https://i.postimg.cc/gkJD38Lv/logo.png"
            alt="StudioPresent Logo"
            className="mobile-menu-logo"
            onClick={() => {
              navigate('/home');
              setMenuOpen(false);
            }}
          />
        </div>
        <nav className="mobile-menu-nav">
          <button
            className="mobile-nav-button"
            onClick={() => {
              navigate('/my-listings');
              setMenuOpen(false);
            }}
          >
            My Listings
          </button>
          <button
            className="mobile-nav-button"
            onClick={() => {
              navigate('/profile');
              setMenuOpen(false);
            }}
          >
            Profile
          </button>
          <button className="mobile-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
