const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build')); // Serve React build files

// File to store emails
const EMAILS_FILE = 'emails.json';

// Initialize emails file if it doesn't exist
if (!fs.existsSync(EMAILS_FILE)) {
  fs.writeFileSync(EMAILS_FILE, JSON.stringify([], null, 2));
}

// API endpoint to collect emails
app.post('/api/collect-email', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Read existing emails
    const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    
    // Check if email already exists
    if (!emails.includes(email)) {
      emails.push({
        email: email,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress
      });
      
      // Save back to file
      fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
      
      console.log(`New email collected: ${email}`);
    }

    res.json({ success: true, message: 'Email collected successfully' });
  } catch (error) {
    console.error('Error collecting email:', error);
    res.status(500).json({ error: 'Failed to collect email' });
  }
});

// API endpoint to view collected emails (for admin purposes)
app.get('/api/emails', (req, res) => {
  try {
    const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    res.json({ emails });
  } catch (error) {
    console.error('Error reading emails:', error);
    res.status(500).json({ error: 'Failed to read emails' });
  }
});

// Serve login page (clean URL)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve admin page (clean URL)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Keep .html versions for backward compatibility
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email collection endpoint: http://localhost:${PORT}/api/collect-email`);
  console.log(`View emails: http://localhost:${PORT}/api/emails`);
}); 