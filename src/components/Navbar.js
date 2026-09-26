import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>SOCIAX</h1>
        </Link>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search Sociax..."
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-actions">
          <div className="navbar-icons">
            <button className="icon-btn" title="Notifications">
              🔔
            </button>
            <button className="icon-btn" title="Messages">
              💬
            </button>
            <button className="icon-btn" title="Settings">
              ⚙️
            </button>
          </div>

          <div className="navbar-profile">
            <img
              src={profile?.profile_picture_url || '/default-avatar.png'}
              alt="Profile"
              className="profile-pic-nav"
            />
            <div className="dropdown">
              <button className="dropdown-btn">
                {profile?.first_name} ▼
              </button>
              <div className="dropdown-content">
                <Link to={`/profile/${profile?.id}`}>View Profile</Link>
                <Link to="/verification">Get Verified</Link>
                <Link to="/settings">Settings</Link>
                <hr />
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
