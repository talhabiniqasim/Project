import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ links }) => {
  const location = useLocation();

  return (
    <div className="sidebar glass-card p-3" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            key={link.path}
            as={Link}
            to={link.path}
            className={`sidebar-link ${location.pathname === link.path ? 'active-link' : ''}`}
          >
            {link.icon && <span className="me-2">{link.icon}</span>}
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
