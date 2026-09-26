import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🏢', label: 'Create Business Page', path: '/business' },
    { icon: '🤖', label: 'Sociax AI', path: '/ai' },
    { icon: '📌', label: 'Saved', path: '/saved' },
    { icon: '📸', label: 'Memories', path: '/memories' },
    { icon: '👥', label: 'Groups', path: '/groups' },
    { icon: '🎮', label: 'Games', path: '/games' },
    { icon: '💭', label: 'Dreams', path: '/dreams' },
    { icon: '🎭', label: 'Avatars', path: '/avatars' },
    { icon: '🎂', label: 'Birthdays', path: '/birthdays' },
    { icon: '📅', label: 'Events', path: '/events' },
    { icon: '📰', label: 'Feeds', path: '/feeds' },
    { icon: '🔍', label: 'Find Friends', path: '/find-friends' },
    { icon: '⭐', label: 'Creator Page', path: '/creator' },
    { icon: '🎯', label: 'Minis', path: '/minis' },
  ];

  const settingsItems = [
    { icon: '❓', label: 'Help & Support', path: '/help' },
    { icon: '🛡️', label: 'Scam Protection', path: '/scam-protection' },
    { icon: '🆘', label: 'Report Problem', path: '/report' },
    { icon: '🔒', label: 'Safety', path: '/safety' },
    { icon: '⚖️', label: 'Terms & Policies', path: '/terms' },
    { icon: '🔐', label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Menu</h3>
        <ul className="menu-list">
          {menuItems.slice(0, 8).map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {!showMore && (
          <ul className="menu-list">
            {menuItems.slice(8, 12).map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {showMore && (
          <>
            <ul className="menu-list">
              {menuItems.slice(8).map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="divider"></div>

            <h3>Settings</h3>
            <ul className="menu-list">
              {settingsItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          className="see-more-btn"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'See Less' : 'See More'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
