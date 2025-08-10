import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { emailService } from '../supabase';
import './AdminPanel.css';

const AdminPanel = ({ onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({
    totalEmails: 0,
    todayEmails: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState('emails');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setIsLoading(true);
      const emailData = await emailService.getAllEmails();
      
      if (emailData && emailData.length > 0) {
        setEmails(emailData);
        updateStats(emailData);
      } else {
        // Fallback to localStorage if Supabase is empty
        const localEmails = JSON.parse(localStorage.getItem('himalayanFlavoursEmails') || '[]');
        setEmails(localEmails);
        updateStats(localEmails);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
      // Fallback to localStorage
      const localEmails = JSON.parse(localStorage.getItem('himalayanFlavoursEmails') || '[]');
      setEmails(localEmails);
      updateStats(localEmails);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (emailData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      totalEmails: emailData.length,
      todayEmails: emailData.filter(email => {
        const emailDate = new Date(email.date || email.timestamp || Date.now());
        return emailDate >= today;
      }).length,
      thisWeek: emailData.filter(email => {
        const emailDate = new Date(email.date || email.timestamp || Date.now());
        return emailDate >= weekAgo;
      }).length,
      thisMonth: emailData.filter(email => {
        const emailDate = new Date(email.date || email.timestamp || Date.now());
        return emailDate >= monthAgo;
      }).length
    };

    setStats(stats);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Date', 'Time'],
      ...emails.map(email => [
        email.email || email,
        new Date(email.date || email.timestamp || Date.now()).toLocaleDateString(),
        new Date(email.date || email.timestamp || Date.now()).toLocaleTimeString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `himalayan-flavours-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedEmails = emails
    .filter(email => {
      const emailText = (email.email || email).toLowerCase();
      return emailText.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || a.email || a;
      const bValue = b[sortBy] || b.email || b;
      
      if (sortBy === 'date' || sortBy === 'timestamp') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedEmails.length / itemsPerPage);
  const paginatedEmails = filteredAndSortedEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="admin-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>Himalayan Flavours Hub</h1>
          <p>Admin Dashboard</p>
        </div>
        <div className="header-right">
          <button className="export-btn" onClick={handleExportCSV}>
            📊 Export CSV
          </button>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{stats.totalEmails}</h3>
            <p>Total Emails</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.todayEmails}</h3>
            <p>Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.thisWeek}</h3>
            <p>This Week</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.thisMonth}</h3>
            <p>This Month</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          📧 Email Subscribers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'emails' && (
          <div className="emails-tab">
            {/* Search and Controls */}
            <div className="emails-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="sort-controls">
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSort(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">Sort by Date</option>
                  <option value="email">Sort by Email</option>
                </select>
                <button 
                  className="sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Emails Table */}
            <div className="emails-table-container">
              <table className="emails-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email Address</th>
                    <th>Date Subscribed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmails.length > 0 ? (
                    paginatedEmails.map((email, index) => (
                      <tr key={index} className="email-row">
                        <td className="row-number">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="email-cell">
                          <span className="email-address">
                            {email.email || email}
                          </span>
                        </td>
                        <td className="date-cell">
                          {formatDate(email.date || email.timestamp || Date.now())}
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn view-btn" title="View Details">
                            👁️
                          </button>
                          <button className="action-btn edit-btn" title="Edit">
                            ✏️
                          </button>
                          <button className="action-btn delete-btn" title="Delete">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">
                        {searchTerm ? 'No emails found matching your search.' : 'No emails collected yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="coming-soon">
              <h3>📊 Analytics Dashboard</h3>
              <p>Coming soon! This will include detailed insights about your email subscribers.</p>
              <div className="feature-preview">
                <div className="preview-item">
                  <span className="preview-icon">📈</span>
                  <span>Growth Trends</span>
                </div>
                <div className="preview-item">
                  <span className="preview-icon">🌍</span>
                  <span>Geographic Data</span>
                </div>
                <div className="preview-item">
                  <span className="preview-icon">⏰</span>
                  <span>Time Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="coming-soon">
              <h3>⚙️ Admin Settings</h3>
              <p>Coming soon! This will include configuration options for your admin panel.</p>
              <div className="feature-preview">
                <div className="preview-item">
                  <span className="preview-icon">👥</span>
                  <span>User Management</span>
                </div>
                <div className="preview-item">
                  <span className="preview-icon">🔐</span>
                  <span>Security Settings</span>
                </div>
                <div className="preview-item">
                  <span className="preview-icon">📧</span>
                  <span>Email Templates</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
