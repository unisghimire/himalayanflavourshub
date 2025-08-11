import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { emailService, storageService, supabase } from '../supabase';
import { contentService } from '../contentService';
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
  
  // Users state
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSortBy, setUserSortBy] = useState('email');
  const [userSortOrder, setUserSortOrder] = useState('asc');
  
  // Content state
  const [content, setContent] = useState({
    hero: {
      title: '',
      subtitle: '',
      primaryButtonText: '',
      secondaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonLink: ''
    },
    story: {
      title: '',
      subtitle: '',
      chapters: []
    },
    products: {
      title: '',
      subtitle: '',
      categories: [],
      products: [],
      cta: {}
    },
    footer: {
      branding: {
        title: '',
        subtitle: '',
        description: ''
      },
      quickLinks: [],
      contactInfo: [],
      socialLinks: [],
      bottom: {
        copyright: '',
        legalLinks: []
      }
    }
  });
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});

  useEffect(() => {
    loadEmails();
    if (activeTab === 'content') {
      loadContent();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'emails') {
      loadEmails();
    } else if (activeTab === 'users') {
      loadUsers();
      loadRoles();
    }
  }, [activeTab]);

  const loadEmails = async () => {
    try {
      setIsLoading(true);
      console.log('Loading emails from Supabase...');
      
      const emailData = await emailService.getAllEmails();
      console.log('Supabase email data:', emailData);
      console.log('Email data type:', typeof emailData);
      console.log('Email data length:', emailData?.length);
      
      if (emailData && emailData.length > 0) {
        console.log('Setting emails from Supabase:', emailData.length, 'emails');
        console.log('First email structure:', emailData[0]);
        setEmails(emailData);
        updateStats(emailData);
      } else {
        console.log('No emails from Supabase, checking localStorage...');
        // Fallback to localStorage if Supabase is empty
        const localEmails = JSON.parse(localStorage.getItem('himalayanFlavoursEmails') || '[]');
        console.log('LocalStorage emails:', localEmails);
        setEmails(localEmails);
        updateStats(localEmails);
      }
    } catch (error) {
      console.error('Error loading emails from Supabase:', error);
      console.log('Falling back to localStorage...');
      // Fallback to localStorage
      const localEmails = JSON.parse(localStorage.getItem('himalayanFlavoursEmails') || '[]');
      console.log('LocalStorage fallback emails:', localEmails);
      setEmails(localEmails);
      updateStats(localEmails);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      const heroContent = await contentService.getSectionContent('hero');
      const storyContent = await contentService.getSectionContent('story');
      const productsContent = await contentService.getSectionContent('products');
      const footerContent = await contentService.getSectionContent('footer');
      
      console.log('Loaded content:', { heroContent, storyContent, productsContent, footerContent });
      
      setContent({
        hero: heroContent || {},
        story: storyContent || {},
        products: productsContent || {},
        footer: footerContent || {}
      });
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setIsUsersLoading(true);
      
      // Use the custom function to get all users with roles
      const { data, error } = await supabase
        .rpc('get_all_users_with_roles');
      
      if (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users. Make sure you have admin privileges.');
        return;
      }
      
      // Transform the data to match our component's expected format
      const transformedUsers = (data || []).map(user => ({
        id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        roles: user.roles || []
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users: ' + error.message);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error loading roles:', error);
        return;
      }
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const assignRole = async (userId, roleId) => {
    try {
      // Get the role name from the role ID
      const role = roles.find(r => r.id === roleId);
      if (!role) {
        alert('Role not found');
        return;
      }
      
      // Use the custom function to assign role
      const { error } = await supabase
        .rpc('assign_role_to_user', { 
          target_user_id: userId, 
          role_name: role.name 
        });
      
      if (error) {
        if (error.message.includes('already exists')) {
          alert('User already has this role');
        } else {
          throw error;
        }
        return;
      }
      
      alert('Role assigned successfully!');
      loadUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role: ' + error.message);
    }
  };

  const removeRole = async (userId, roleId) => {
    try {
      // Get the role name from the role ID
      const role = roles.find(r => r.id === roleId);
      if (!role) {
        alert('Role not found');
        return;
      }
      
      // Use the custom function to remove role
      const { error } = await supabase
        .rpc('remove_role_from_user', { 
          target_user_id: userId, 
          role_name: role.name 
        });
      
      if (error) {
        throw error;
      }
      
      alert('Role removed successfully!');
      loadUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error removing role:', error);
      alert('Failed to remove role: ' + error.message);
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
        const emailDate = new Date(email.created_at || email.date || email.timestamp || Date.now());
        return emailDate >= today;
      }).length,
      thisWeek: emailData.filter(email => {
        const emailDate = new Date(email.created_at || email.date || email.timestamp || Date.now());
        return emailDate >= weekAgo;
      }).length,
      thisMonth: emailData.filter(email => {
        const emailDate = new Date(email.created_at || email.date || email.timestamp || Date.now());
        return emailDate >= monthAgo;
      }).length
    };

    setStats(stats);
  };

  const handleContentChange = (section, field, value, index = null) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (index !== null) {
        // Handle array items (chapters, products, footer arrays)
        if (section === 'story' && field === 'chapters') {
          newContent.story.chapters[index] = { ...newContent.story.chapters[index], ...value };
        } else if (section === 'products' && field === 'products') {
          newContent.products.products[index] = { ...newContent.products.products[index], ...value };
        } else if (section === 'footer' && (field === 'quickLinks' || field === 'contactInfo' || field === 'socialLinks')) {
          newContent.footer[field][index] = { ...newContent.footer[field][index], ...value };
        } else if (section === 'footer' && field === 'legalLinks') {
          newContent.footer.bottom.legalLinks[index] = { ...newContent.footer.bottom.legalLinks[index], ...value };
        }
      } else {
        // Handle direct fields
        if (typeof newContent[section][field] === 'object') {
          newContent[section][field] = { ...newContent[section][field], ...value };
        } else {
          newContent[section][field] = value;
        }
      }
      return newContent;
    });
  };

  const handleImageUpload = async (file, productIndex) => {
    if (!file) return;

    try {
      setUploadingImages(prev => ({ ...prev, [productIndex]: true }));
      
      // Generate a unique product ID if none exists
      const productId = content.products.products[productIndex].id || `temp-${Date.now()}`;
      
      // Upload image to Supabase storage
      const imageUrl = await storageService.uploadProductImage(file, productId);
      
      // Update the product with the new image URL
      handleContentChange('products', 'products', { image: imageUrl }, productIndex);
      
      // If this was a temporary product, update the ID
      if (!content.products.products[productIndex].id) {
        handleContentChange('products', 'products', { id: productId }, productIndex);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [productIndex]: false }));
    }
  };

  const handleRemoveImage = async (productIndex) => {
    const product = content.products.products[productIndex];
    if (product.image && product.image !== product.icon) { // Don't delete if it's the emoji icon
      try {
        await storageService.deleteProductImage(product.image);
        handleContentChange('products', 'products', { image: '' }, productIndex);
      } catch (error) {
        console.error('Error removing image:', error);
        alert('Failed to remove image. Please try again.');
      }
    } else {
      // Just clear the image field if it's an emoji
      handleContentChange('products', 'products', { image: '' }, productIndex);
    }
  };

  const handleSaveContent = async (section) => {
    try {
      const success = await contentService.updateSectionContent(section, content[section]);
      if (success) {
        alert(`${section} content saved successfully!`);
      } else {
        alert(`Failed to save ${section} content. Please try again.`);
      }
    } catch (error) {
      console.error(`Error saving ${section} content:`, error);
      alert(`Error saving ${section} content: ${error.message}`);
    }
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
      const aValue = a[sortBy] || a.created_at || a.date || a.email || a;
      const bValue = b[sortBy] || b.created_at || b.date || b.email || b;
      
      if (sortBy === 'date' || sortBy === 'timestamp' || sortBy === 'created_at') {
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
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📝 Content
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
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
            <div className="emails-header">
              <h3>📧 Email Subscribers</h3>
              <p>Manage your email subscription list</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadEmails}
                >
                  🔄 Refresh Emails
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={async () => {
                    try {
                      await emailService.addEmail(`test-${Date.now()}@example.com`);
                      alert('Test email added! Click Refresh to see it.');
                    } catch (error) {
                      alert('Error adding test email: ' + error.message);
                    }
                  }}
                >
                  ➕ Add Test Email
                </button>
              </div>
            </div>
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
                          {formatDate(email.created_at || email.date || email.timestamp || Date.now())}
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

        {activeTab === 'content' && (
          <div className="content-tab">
            <div className="content-header">
              <h3>Content Management</h3>
              <p>Update your landing page content. Changes are saved automatically.</p>
              <button 
                className="btn btn-secondary" 
                onClick={loadContent}
                style={{ marginBottom: '20px' }}
              >
                🔄 Refresh Content
              </button>
            </div>
            <div className="content-management">
              
              {isContentLoading && (
                <div className="loading-indicator">
                  <span>🔄 Loading content from database...</span>
                </div>
              )}
              
              <div className="content-sections">
                <div className="content-section">
                  <h4>🏔️ Hero Section</h4>
                  <div className="content-form">
                    <div className="form-group">
                      <label>Title:</label>
                      <input 
                        type="text" 
                        className="content-input"
                        placeholder="Enter hero title..."
                        value={content.hero.title}
                        onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtitle:</label>
                      <textarea 
                        className="content-textarea"
                        placeholder="Enter hero subtitle..."
                        rows="3"
                        value={content.hero.subtitle}
                        onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Primary Button Text:</label>
                        <input 
                          type="text" 
                          className="content-input"
                          placeholder="e.g., Our Story"
                          value={content.hero.primaryButtonText}
                          onChange={(e) => handleContentChange('hero', 'primaryButtonText', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Secondary Button Text:</label>
                        <input 
                          type="text" 
                          className="content-input"
                          placeholder="e.g., Explore Products"
                          value={content.hero.secondaryButtonText}
                          onChange={(e) => handleContentChange('hero', 'secondaryButtonText', e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleSaveContent('hero')}>💾 Save Hero Content</button>
                  </div>
                </div>

                <div className="content-section">
                  <h4>📖 Story Section</h4>
                  <div className="content-form">
                    <div className="form-group">
                      <label>Section Title:</label>
                      <input 
                        type="text" 
                        className="content-input"
                        placeholder="Enter section title..."
                        value={content.story.title}
                        onChange={(e) => handleContentChange('story', 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Section Subtitle:</label>
                      <textarea 
                        className="content-textarea"
                        placeholder="Enter section subtitle..."
                        rows="2"
                        value={content.story.subtitle}
                        onChange={(e) => handleContentChange('story', 'subtitle', e.target.value)}
                      ></textarea>
                    </div>
                    <div className="chapters-editor">
                      <div className="chapters-header">
                        <h5>Chapters:</h5>
                        <button className="btn btn-secondary" onClick={() => {
                          const newChapters = [...content.story.chapters, { title: '', content: '', icon: '' }];
                          setContent(prev => ({ ...prev, story: { ...prev.story, chapters: newChapters } }));
                        }}>➕ Add Chapter</button>
                      </div>
                      
                      <div className="chapters-table-container">
                        <table className="chapters-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Chapter Title</th>
                              <th>Icon</th>
                              <th>Content</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {content.story.chapters.map((chapter, index) => (
                              <tr key={index} className="chapter-row">
                                <td className="row-number">{String(index + 1).padStart(2, '0')}</td>
                                
                                <td className="chapter-title-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="Chapter title..."
                                    value={chapter.title}
                                    onChange={(e) => handleContentChange('story', 'chapters', { title: e.target.value }, index)}
                                  />
                                </td>
                                
                                <td className="chapter-icon-cell">
                                  <div className="emoji-display-container">
                                    <div className="current-emoji">
                                      {chapter.icon || '🏔️'}
                                    </div>
                                    <select 
                                      className="content-select table-select emoji-select"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('story', 'chapters', { icon: e.target.value }, index);
                                        }
                                      }}
                                    >
                                      <option value="">Select from options</option>
                                      <optgroup label="🏔️ Mountains & Nature">
                                        <option value="🏔️">🏔️ Snow Capped Mountain</option>
                                        <option value="⛰️">⛰️ Mountain</option>
                                        <option value="🌄">🌄 Sunrise Over Mountains</option>
                                        <option value="🌅">🌅 Sunrise</option>
                                        <option value="🌊">🌊 Wave</option>
                                        <option value="🌲">🌲 Evergreen Tree</option>
                                        <option value="🌳">🌳 Deciduous Tree</option>
                                        <option value="🌴">🌴 Palm Tree</option>
                                        <option value="🌵">🌵 Cactus</option>
                                        <option value="🌸">🌸 Cherry Blossom</option>
                                        <option value="🌺">🌺 Hibiscus</option>
                                        <option value="🌻">🌻 Sunflower</option>
                                      </optgroup>
                                      <optgroup label="🌿 Spices & Herbs">
                                        <option value="🌶️">🌶️ Hot Pepper</option>
                                        <option value="🌿">🌿 Herb</option>
                                        <option value="🍃">🍃 Leaf</option>
                                        <option value="🌱">🌱 Seedling</option>
                                        <option value="🌾">🌾 Sheaf of Rice</option>
                                        <option value="🌽">🌽 Ear of Corn</option>
                                        <option value="🧄">🧄 Garlic</option>
                                        <option value="🧅">🧅 Onion</option>
                                        <option value="🥕">🥕 Carrot</option>
                                        <option value="🥔">🥔 Potato</option>
                                        <option value="🥜">🥜 Peanuts</option>
                                        <option value="🌰">🌰 Chestnut</option>
                                      </optgroup>
                                      <optgroup label="✨ Special & Premium">
                                        <option value="✨">✨ Sparkles</option>
                                        <option value="💎">💎 Gem Stone</option>
                                        <option value="🌟">🌟 Glowing Star</option>
                                        <option value="⭐">⭐ Star</option>
                                        <option value="🔥">🔥 Fire</option>
                                        <option value="💫">💫 Dizzy</option>
                                        <option value="🌙">🌙 Crescent Moon</option>
                                        <option value="☀️">☀️ Sun</option>
                                        <option value="🌈">🌈 Rainbow</option>
                                        <option value="❄️">❄️ Snowflake</option>
                                        <option value="🍀">🍀 Four Leaf Clover</option>
                                        <option value="🎋">🎋 Tanabata Tree</option>
                                      </optgroup>
                                      <optgroup label="🚚 Journey & Travel">
                                        <option value="🚚">🚚 Delivery Truck</option>
                                        <option value="🚛">🚛 Articulated Lorry</option>
                                        <option value="🚗">🚗 Automobile</option>
                                        <option value="🚙">🚙 Sport Utility Vehicle</option>
                                        <option value="🚲">🚲 Bicycle</option>
                                        <option value="🛵">🛵 Motor Scooter</option>
                                        <option value="✈️">✈️ Airplane</option>
                                        <option value="🚁">🚁 Helicopter</option>
                                        <option value="🚢">🚢 Ship</option>
                                        <option value="🚂">🚂 Locomotive</option>
                                        <option value="🚇">🚇 Metro</option>
                                        <option value="🚌">🚌 Bus</option>
                                      </optgroup>
                                    </select>
                                    <div className="emoji-custom-input">
                                      <input 
                                        type="text" 
                                        className="content-input table-input emoji-text-input"
                                        placeholder="Or paste custom emoji"
                                        value=""
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleContentChange('story', 'chapters', { icon: e.target.value }, index);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="chapter-content-cell">
                                  <textarea 
                                    className="content-textarea table-textarea"
                                    placeholder="Chapter content..."
                                    rows="4"
                                    value={chapter.content}
                                    onChange={(e) => handleContentChange('story', 'chapters', { content: e.target.value }, index)}
                                  ></textarea>
                                </td>
                                
                                <td className="chapter-actions-cell">
                                  <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                      const newChapters = content.story.chapters.filter((_, i) => i !== index);
                                      setContent(prev => ({ ...prev, story: { ...prev.story, chapters: newChapters } }));
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <button className="btn btn-primary" onClick={() => handleSaveContent('story')}>💾 Save Story Content</button>
                  </div>
                </div>

                {/* Products Content Management */}
                <div className="content-section">
                  <div className="section-header">
                    <h3>🛍️ Products Section</h3>
                    <p>Manage your product catalog, categories, and product details</p>
                  </div>
                  
                  <div className="content-form">
                    <div className="form-group">
                      <label>Section Title:</label>
                      <input 
                        type="text" 
                        className="content-input"
                        placeholder="Enter section title..."
                        value={content.products?.title || ''}
                        onChange={(e) => handleContentChange('products', 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Section Subtitle:</label>
                      <textarea 
                        className="content-textarea"
                        placeholder="Enter section subtitle..."
                        rows="2"
                        value={content.products?.subtitle || ''}
                        onChange={(e) => handleContentChange('products', 'subtitle', e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="products-editor">
                      <div className="products-header">
                        <h5>Products:</h5>
                        <button className="btn btn-secondary" onClick={() => {
                          const newProducts = [...(content.products?.products || []), { 
                            name: '', 
                            category: 'spices', 
                            description: '', 
                            price: '', 
                            icon: '', 
                            story: '',
                            image: ''
                          }];
                          setContent(prev => ({ ...prev, products: { ...prev.products, products: newProducts } }));
                        }}>➕ Add Product</button>
                      </div>
                      
                      {/* Category Management Section */}
                      <div className="category-management">
                        <h6>📂 Manage Product Categories</h6>
                        <div className="categories-list">
                          {(content.products?.categories || []).map((category, index) => (
                            <div key={index} className="category-item">
                              <input 
                                type="text" 
                                className="content-input category-name-input"
                                placeholder="Category name..."
                                value={category.name}
                                onChange={(e) => {
                                  const newCategories = [...content.products.categories];
                                  newCategories[index] = { ...category, name: e.target.value };
                                  setContent(prev => ({ 
                                    ...prev, 
                                    products: { ...prev.products, categories: newCategories } 
                                  }));
                                }}
                              />
                              <input 
                                type="text" 
                                className="content-input category-icon-input"
                                placeholder="Category icon (e.g., 🌶️)"
                                value={category.icon}
                                onChange={(e) => {
                                  const newCategories = [...content.products.categories];
                                  newCategories[index] = { ...category, icon: e.target.value };
                                  setContent(prev => ({ 
                                    ...prev, 
                                    products: { ...prev.products, categories: newCategories } 
                                  }));
                                }}
                              />
                              <button 
                                className="btn btn-danger btn-small"
                                onClick={() => {
                                  const newCategories = content.products.categories.filter((_, i) => i !== index);
                                  setContent(prev => ({ 
                                    ...prev, 
                                    products: { ...prev.products, categories: newCategories } 
                                  }));
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => {
                            const newCategories = [...(content.products?.categories || []), { name: '', icon: '🌿' }];
                            setContent(prev => ({ 
                              ...prev, 
                              products: { ...prev.products, categories: newCategories } 
                            }));
                          }}
                        >
                          ➕ Add Category
                        </button>
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleSaveContent('products')}
                          style={{ marginLeft: '10px' }}
                        >
                          💾 Save Categories
                        </button>
                      </div>
                      
                      <div className="products-table-container">
                        <table className="products-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product Name</th>
                              <th>Category</th>
                              <th>Image</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Icon</th>
                              <th>Story</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(content.products?.products || []).map((product, index) => (
                              <tr key={index} className="product-row">
                                <td className="row-number">{index + 1}</td>
                                
                                <td className="product-name-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="Product name..."
                                    value={product.name}
                                    onChange={(e) => handleContentChange('products', 'products', { name: e.target.value }, index)}
                                  />
                                </td>
                                
                                <td className="product-category-cell">
                                  <select 
                                    className="content-select table-select" 
                                    value={product.category} 
                                    onChange={(e) => handleContentChange('products', 'products', { category: e.target.value }, index)}
                                  >
                                    {(content.products?.categories || []).map((cat, catIndex) => (
                                      <option key={catIndex} value={cat.name}>
                                        {cat.icon} {cat.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                
                                <td className="product-image-cell">
                                  <div className="image-upload-container">
                                    {product.image ? (
                                      <div className="image-preview">
                                        <img 
                                          src={product.image} 
                                          alt={product.name || 'Product'} 
                                          className="product-image-preview"
                                        />
                                        <button 
                                          type="button" 
                                          className="btn btn-danger btn-small"
                                          onClick={() => handleRemoveImage(index)}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="image-upload-placeholder">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(e.target.files[0], index)}
                                          className="image-file-input"
                                          id={`image-upload-${index}`}
                                        />
                                        <label htmlFor={`image-upload-${index}`} className="image-upload-label">
                                          {uploadingImages[index] ? (
                                            <span>🔄</span>
                                          ) : (
                                            <span>📁</span>
                                          )}
                                        </label>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                
                                <td className="product-description-cell">
                                  <textarea 
                                    className="content-textarea table-textarea"
                                    placeholder="Product description..."
                                    rows="2"
                                    value={product.description}
                                    onChange={(e) => handleContentChange('products', 'products', { description: e.target.value }, index)}
                                  ></textarea>
                                </td>
                                
                                <td className="product-price-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="Price (e.g., $12.99)"
                                    value={product.price}
                                    onChange={(e) => handleContentChange('products', 'products', { price: e.target.value }, index)}
                                  />
                                </td>
                                
                                <td className="product-icon-cell">
                                  <div className="emoji-display-container">
                                    <div className="current-emoji">
                                      {product.icon || '🌿'}
                                    </div>
                                    <select 
                                      className="content-select table-select emoji-select"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('products', 'products', { icon: e.target.value }, index);
                                        }
                                      }}
                                    >
                                      <option value="">Select from options</option>
                                      <optgroup label="🌿 Spices & Herbs">
                                        <option value="🌶️">🌶️ Hot Pepper</option>
                                        <option value="🌿">🌿 Herb</option>
                                        <option value="🍃">🍃 Leaf</option>
                                        <option value="🌱">🌱 Seedling</option>
                                        <option value="🌾">🌾 Sheaf of Rice</option>
                                        <option value="🌽">🌽 Ear of Corn</option>
                                        <option value="🧄">🧄 Garlic</option>
                                        <option value="🧅">🧅 Onion</option>
                                        <option value="🥕">🥕 Carrot</option>
                                        <option value="🥔">🥔 Potato</option>
                                        <option value="🥜">🥜 Peanuts</option>
                                        <option value="🌰">🌰 Chestnut</option>
                                      </optgroup>
                                      <optgroup label="🏔️ Mountains & Nature">
                                        <option value="🏔️">🏔️ Snow Capped Mountain</option>
                                        <option value="⛰️">⛰️ Mountain</option>
                                        <option value="🌄">🌄 Sunrise Over Mountains</option>
                                        <option value="🌅">🌅 Sunrise</option>
                                        <option value="🌊">🌊 Wave</option>
                                        <option value="🌲">🌲 Evergreen Tree</option>
                                        <option value="🌳">🌳 Deciduous Tree</option>
                                        <option value="🌴">🌴 Palm Tree</option>
                                        <option value="🌵">🌵 Cactus</option>
                                        <option value="🌸">🌸 Cherry Blossom</option>
                                        <option value="🌺">🌺 Hibiscus</option>
                                        <option value="🌻">🌻 Sunflower</option>
                                      </optgroup>
                                      <optgroup label="✨ Special & Premium">
                                        <option value="✨">✨ Sparkles</option>
                                        <option value="💎">💎 Gem Stone</option>
                                        <option value="🌟">🌟 Glowing Star</option>
                                        <option value="⭐">⭐ Star</option>
                                        <option value="🔥">🔥 Fire</option>
                                        <option value="💫">💫 Dizzy</option>
                                        <option value="🌙">🌙 Crescent Moon</option>
                                        <option value="☀️">☀️ Sun</option>
                                        <option value="🌈">🌈 Rainbow</option>
                                        <option value="❄️">❄️ Snowflake</option>
                                        <option value="🍀">🍀 Four Leaf Clover</option>
                                        <option value="🎋">🎋 Tanabata Tree</option>
                                      </optgroup>
                                      <optgroup label="🍽️ Food & Cooking">
                                        <option value="🍽️">🍽️ Fork and Knife with Plate</option>
                                        <option value="🥘">🥘 Pan of Food</option>
                                        <option value="🍳">🍳 Cooking</option>
                                        <option value="💧">💧 Droplet</option>
                                        <option value="🍯">🍯 Honey Pot</option>
                                        <option value="🥄">🥄 Spoon</option>
                                        <option value="🔪">🔪 Kitchen Knife</option>
                                        <option value="⚖️">⚖️ Balance Scale</option>
                                        <option value="📏">📏 Straight Ruler</option>
                                        <option value="🎯">🎯 Direct Hit</option>
                                      </optgroup>
                                    </select>
                                    <div className="emoji-custom-input">
                                      <input 
                                        type="text" 
                                        className="content-input table-input emoji-text-input"
                                        placeholder="Or paste custom emoji"
                                        value=""
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleContentChange('products', 'products', { icon: e.target.value }, index);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="product-story-cell">
                                  <textarea 
                                    className="content-textarea table-textarea"
                                    placeholder="Product story..."
                                    rows="2"
                                    value={product.story}
                                    onChange={(e) => handleContentChange('products', 'products', { story: e.target.value }, index)}
                                  ></textarea>
                                </td>
                                
                                <td className="product-actions-cell">
                                  <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                      const newProducts = content.products.products.filter((_, i) => i !== index);
                                      setContent(prev => ({ ...prev, products: { ...prev.products, products: newProducts } }));
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <button className="btn btn-primary" onClick={() => handleSaveContent('products')}>💾 Save Products Content</button>
                    </div>
                  </div>
                </div>

                {/* Footer Content Management */}
                <div className="content-section">
                  <div className="section-header">
                    <h3>📄 Footer Content</h3>
                    <p>Customize your footer branding, links, and contact information</p>
                  </div>
                  
                  <div className="footer-editor">
                    {/* Branding Section */}
                    <div className="footer-branding">
                      <h5>🏷️ Branding & Description</h5>
                      <div className="form-group">
                        <label>Logo Title:</label>
                        <input 
                          type="text" 
                          className="content-input"
                          placeholder="HIMALAYAN FLAVOURS HUB"
                          value={content.footer?.branding?.title || ''}
                          onChange={(e) => handleContentChange('footer', 'branding', { title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Logo Subtitle:</label>
                        <input 
                          type="text" 
                          className="content-input"
                          placeholder="From Top of the World"
                          value={content.footer?.branding?.subtitle || ''}
                          onChange={(e) => handleContentChange('footer', 'branding', { subtitle: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Footer Description:</label>
                        <textarea 
                          className="content-textarea"
                          placeholder="Bringing authentic Himalayan spices and flavors to your kitchen..."
                          rows="3"
                          value={content.footer?.branding?.description || ''}
                          onChange={(e) => handleContentChange('footer', 'branding', { description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="footer-links-section">
                      <h5>🔗 Quick Links</h5>
                      <div className="links-table-container">
                        <table className="links-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Link Text</th>
                              <th>Link URL</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(content.footer?.quickLinks || []).map((link, index) => (
                              <tr key={index} className="link-row">
                                <td className="row-number">{String(index + 1).padStart(2, '0')}</td>
                                <td className="link-text-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="Link text..."
                                    value={link.text || ''}
                                    onChange={(e) => handleContentChange('footer', 'quickLinks', { text: e.target.value }, index)}
                                  />
                                </td>
                                <td className="link-url-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="#section or /page"
                                    value={link.url || ''}
                                    onChange={(e) => handleContentChange('footer', 'quickLinks', { url: e.target.value }, index)}
                                  />
                                </td>
                                <td className="link-actions-cell">
                                  <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                      const newLinks = content.footer.quickLinks.filter((_, i) => i !== index);
                                      setContent(prev => ({ 
                                        ...prev, 
                                        footer: { ...prev.footer, quickLinks: newLinks } 
                                      }));
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          const newLinks = [...(content.footer?.quickLinks || []), { text: '', url: '' }];
                          setContent(prev => ({ 
                            ...prev, 
                            footer: { ...prev.footer, quickLinks: newLinks } 
                          }));
                        }}
                      >
                        ➕ Add Link
                      </button>
                    </div>

                    {/* Contact Information Section */}
                    <div className="footer-contact-section">
                      <h5>📞 Contact Information</h5>
                      <div className="contact-table-container">
                        <table className="contact-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Icon</th>
                              <th>Content</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(content.footer?.contactInfo || []).map((contact, index) => (
                              <tr key={index} className="contact-row">
                                <td className="contact-type-cell">
                                  <select 
                                    className="content-select table-select"
                                    value={contact.type || ''}
                                    onChange={(e) => handleContentChange('footer', 'contactInfo', { type: e.target.value }, index)}
                                  >
                                    <option value="">Select type...</option>
                                    <option value="address">Address</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="hours">Business Hours</option>
                                  </select>
                                </td>
                                <td className="contact-icon-cell">
                                  <div className="emoji-display-container">
                                    <div className="current-emoji">
                                      {contact.icon || '📍'}
                                    </div>
                                    <select 
                                      className="content-select table-select emoji-select"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('footer', 'contactInfo', { icon: e.target.value }, index);
                                        }
                                      }}
                                    >
                                      <option value="">Select icon</option>
                                      <option value="📍">📍 Location</option>
                                      <option value="📧">📧 Email</option>
                                      <option value="📞">📞 Phone</option>
                                      <option value="📱">📱 Mobile</option>
                                      <option value="⏰">⏰ Clock</option>
                                      <option value="🏢">🏢 Building</option>
                                      <option value="🌍">🌍 Globe</option>
                                      <option value="💼">💼 Briefcase</option>
                                    </select>
                                    <input 
                                      type="text" 
                                      className="content-input table-input emoji-text-input"
                                      placeholder="Or paste custom emoji"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('footer', 'contactInfo', { icon: e.target.value }, index);
                                        }
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="contact-content-cell">
                                  <input 
                                    type="text" 
                                    className="content-input table-input"
                                    placeholder="Contact content..."
                                    value={contact.content || ''}
                                    onChange={(e) => handleContentChange('footer', 'contactInfo', { content: e.target.value }, index)}
                                  />
                                </td>
                                <td className="contact-actions-cell">
                                  <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                      const newContacts = content.footer.contactInfo.filter((_, i) => i !== index);
                                      setContent(prev => ({ 
                                        ...prev, 
                                        footer: { ...prev.footer, contactInfo: newContacts } 
                                      }));
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          const newContacts = [...(content.footer?.contactInfo || []), { type: '', icon: '', content: '' }];
                          setContent(prev => ({ 
                            ...prev, 
                            footer: { ...prev.footer, contactInfo: newContacts } 
                          }));
                        }}
                      >
                        ➕ Add Contact
                      </button>
                    </div>

                    {/* Social Media Section */}
                    <div className="footer-social-section">
                      <h5>📱 Social Media Links</h5>
                      <div className="social-table-container">
                        <table className="social-table">
                          <thead>
                            <tr>
                              <th>Platform</th>
                              <th>Icon</th>
                              <th>URL</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(content.footer?.socialLinks || []).map((social, index) => (
                              <tr key={index} className="social-row">
                                <td className="social-platform-cell">
                                  <select 
                                    className="content-select table-select"
                                    value={social.platform || ''}
                                    onChange={(e) => handleContentChange('footer', 'socialLinks', { platform: e.target.value }, index)}
                                  >
                                    <option value="">Select platform...</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="telegram">Telegram</option>
                                  </select>
                                </td>
                                <td className="social-icon-cell">
                                  <div className="emoji-display-container">
                                    <div className="current-emoji">
                                      {social.icon || '📘'}
                                    </div>
                                    <select 
                                      className="content-select table-select emoji-select"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('footer', 'socialLinks', { icon: e.target.value }, index);
                                        }
                                      }}
                                    >
                                      <option value="">Select icon</option>
                                      <option value="📘">📘 Facebook</option>
                                      <option value="📷">📷 Instagram</option>
                                      <option value="🐦">🐦 Twitter</option>
                                      <option value="💼">💼 LinkedIn</option>
                                      <option value="📺">📺 YouTube</option>
                                      <option value="🎵">🎵 TikTok</option>
                                      <option value="📱">📱 WhatsApp</option>
                                      <option value="📡">📡 Telegram</option>
                                    </select>
                                    <input 
                                      type="text" 
                                      className="content-input table-input emoji-text-input"
                                      placeholder="Or paste custom emoji"
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleContentChange('footer', 'socialLinks', { icon: e.target.value }, index);
                                        }
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="social-url-cell">
                                  <input 
                                    type="url" 
                                    className="content-input table-input"
                                    placeholder="https://..."
                                    value={social.url || ''}
                                    onChange={(e) => handleContentChange('footer', 'socialLinks', { url: e.target.value }, index)}
                                  />
                                </td>
                                <td className="social-actions-cell">
                                  <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                      const newSocials = content.footer.socialLinks.filter((_, i) => i !== index);
                                      setContent(prev => ({ 
                                        ...prev, 
                                        footer: { ...prev.footer, socialLinks: newSocials } 
                                      }));
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          const newSocials = [...(content.footer?.socialLinks || []), { platform: '', icon: '', url: '' }];
                          setContent(prev => ({ 
                            ...prev, 
                            footer: { ...prev.footer, socialLinks: newSocials } 
                          }));
                        }}
                      >
                        ➕ Add Social
                      </button>
                    </div>

                    {/* Footer Bottom Section */}
                    <div className="footer-bottom-section">
                      <h5>📄 Footer Bottom</h5>
                      <div className="form-group">
                        <label>Copyright Text:</label>
                        <input 
                          type="text" 
                          className="content-input"
                          placeholder="© 2025 Himalayan Flavours Hub. All rights reserved."
                          value={content.footer?.bottom?.copyright || ''}
                          onChange={(e) => handleContentChange('footer', 'bottom', { copyright: e.target.value })}
                        />
                      </div>
                      <div className="bottom-links-section">
                        <label>Legal Links:</label>
                        <div className="bottom-links-table-container">
                          <table className="bottom-links-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Link Text</th>
                                <th>Link URL</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(content.footer?.bottom?.legalLinks || []).map((link, index) => (
                                <tr key={index} className="legal-link-row">
                                  <td className="row-number">{String(index + 1).padStart(2, '0')}</td>
                                  <td className="legal-link-text-cell">
                                    <input 
                                      type="text" 
                                      className="content-input table-input"
                                      placeholder="Link text..."
                                      value={link.text || ''}
                                      onChange={(e) => handleContentChange('footer', 'bottom', 'legalLinks', { text: e.target.value }, index)}
                                    />
                                  </td>
                                  <td className="legal-link-url-cell">
                                    <input 
                                      type="text" 
                                      className="content-input table-input"
                                      placeholder="/privacy or /terms"
                                      value={link.url || ''}
                                      onChange={(e) => handleContentChange('footer', 'bottom', 'legalLinks', { url: e.target.value }, index)}
                                    />
                                  </td>
                                  <td className="legal-link-actions-cell">
                                    <button 
                                      className="btn btn-danger btn-small"
                                      onClick={() => {
                                        const newLegalLinks = content.footer.bottom.legalLinks.filter((_, i) => i !== index);
                                        setContent(prev => ({ 
                                          ...prev, 
                                          footer: { 
                                            ...prev.footer, 
                                            bottom: { ...prev.footer.bottom, legalLinks: newLegalLinks } 
                                          } 
                                        }));
                                      }}
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => {
                            const newLegalLinks = [...(content.footer?.bottom?.legalLinks || []), { text: '', url: '' }];
                            setContent(prev => ({ 
                              ...prev, 
                              footer: { 
                                ...prev.footer, 
                                bottom: { ...prev.footer.bottom, legalLinks: newLegalLinks } 
                              } 
                            }));
                          }}
                        >
                          ➕ Add Legal Link
                        </button>
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={() => handleSaveContent('footer')}>💾 Save Footer Content</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="users-header">
              <h3>👥 User Management</h3>
              <p>Manage user accounts and assign roles</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadUsers}
                >
                  🔄 Refresh Users
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadRoles}
                >
                  🔄 Refresh Roles
                </button>
              </div>
            </div>

            {/* Users Search and Controls */}
            <div className="users-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="sort-controls">
                <select 
                  value={userSortBy} 
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="email">Sort by Email</option>
                  <option value="created_at">Sort by Date Created</option>
                  <option value="last_sign_in">Sort by Last Sign In</option>
                </select>
                <button 
                  className="sort-order-btn"
                  onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {userSortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
              {isUsersLoading ? (
                <div className="loading-indicator">
                  <span>🔄 Loading users...</span>
                </div>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Date Created</th>
                      <th>Last Sign In</th>
                      <th>Current Roles</th>
                      <th>Assign Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users
                        .filter(user => 
                          user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                        .sort((a, b) => {
                          const aValue = a[userSortBy];
                          const bValue = b[userSortBy];
                          
                          if (userSortBy === 'created_at' || userSortBy === 'last_sign_in') {
                            const aDate = new Date(aValue || 0);
                            const bDate = new Date(bValue || 0);
                            return userSortOrder === 'asc' ? aDate - bDate : bDate - aDate;
                          }
                          
                          if (typeof aValue === 'string' && typeof bValue === 'string') {
                            return userSortOrder === 'asc' 
                              ? aValue.localeCompare(bValue)
                              : bValue.localeCompare(aValue);
                          }
                          
                          return 0;
                        })
                        .map((user, index) => (
                          <tr key={user.id} className="user-row">
                            <td className="row-number">{index + 1}</td>
                            <td className="user-email-cell">
                              <span className="user-email">{user.email}</span>
                            </td>
                            <td className="user-date-cell">
                              {user.created_at ? formatDate(user.created_at) : 'N/A'}
                            </td>
                            <td className="user-last-signin-cell">
                              {user.last_sign_in ? formatDate(user.last_sign_in) : 'N/A'}
                            </td>
                            <td className="user-roles-cell">
                              <div className="user-roles">
                                    {user.roles && user.roles.length > 0 ? (
                                      user.roles.map((role, roleIndex) => (
                                        <span key={roleIndex} className="role-badge">
                                          {role}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="no-role">No roles assigned</span>
                                    )}
                                  </div>
                            </td>
                            <td className="user-assign-role-cell">
                              <select 
                                className="role-select"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const roleId = parseInt(e.target.value);
                                    assignRole(user.id, roleId);
                                    e.target.value = ''; // Reset selection
                                  }
                                }}
                              >
                                <option value="">Select role...</option>
                                {roles.map(role => (
                                  <option key={role.id} value={role.id}>
                                    {role.name} - {role.description}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="user-actions-cell">
                              <button 
                                className="action-btn view-btn" 
                                title="View User Details"
                                onClick={() => alert(`User ID: ${user.id}\nEmail: ${user.email}\nCreated: ${user.created_at}\nLast Sign In: ${user.last_sign_in || 'Never'}`)}
                              >
                                👁️
                              </button>
                              {user.roles && user.roles.length > 0 && (
                                <button 
                                  className="action-btn remove-role-btn" 
                                  title="Remove All Roles"
                                  onClick={() => {
                                    if (window.confirm(`Remove all roles from ${user.email}?`)) {
                                      user.roles.forEach(roleName => {
                                        const role = roles.find(r => r.name === roleName);
                                        if (role) {
                                          removeRole(user.id, role.id);
                                        }
                                      });
                                    }
                                  }}
                                >
                                  🗑️
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="no-data">
                          {userSearchTerm ? 'No users found matching your search.' : 'No users found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
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
