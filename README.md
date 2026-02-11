# 🌑 DarkSignals - Signal-Driven Advertising Platform

A complete, production-ready digital advertising platform with role-based dashboards, glassmorphism UI, and signal-driven analytics.

![DarkSignals Platform](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![HTML5](https://img.shields.io/badge/HTML5-Single%20File-orange)

## 🎯 Overview

**DarkSignals** is a modern, dark-themed advertising platform that connects advertisers with publishers through a verification-first, signal-driven approach. Built as a single-file HTML application with zero dependencies, it's ready for immediate deployment and backend integration.

### ✨ Key Features

- **🎨 Dark-Only Theme** - Sleek glassmorphism UI with soft neon accents
- **👥 Three User Roles** - Advertiser, Developer/Publisher, and Admin dashboards
- **📊 Signal Strength Metrics** - Real-time performance tracking
- **✅ Verification System** - Trust-first content verification
- **💰 Wallet Management** - Built-in payment and withdrawal flows
- **📱 Mobile-First** - Fully responsive design
- **🚀 Zero Dependencies** - Pure HTML/CSS/JS, no frameworks needed

---

## 📋 Complete Page Structure (13 Pages)

### 1️⃣ **Landing Page**
- Brand logo with animated glow effect
- Role selection cards (Advertiser / Developer)
- Clean entry point with no pricing clutter

### 2️⃣ **Authentication**
- Login / Register tabs
- Role selection during signup
- Forgot password flow
- Email/OTP ready UI

### 3️⃣ **Advertiser Dashboard**
- Overview with 4 stat cards (Active Campaigns, Total Reach, Engagement, Budget)
- Signal Strength meter with performance indicators
- Recent campaigns grid with live previews
- Campaign status badges (Live / Paused / Review)

### 4️⃣ **Create Campaign (Signal Activation)**
- 5-step stepper UI:
  1. Platform selection (YouTube, Instagram, Website)
  2. Content upload/URL
  3. Objective selection (Views / Engagement / Clicks)
  4. Budget input
  5. Review & activate
- Clean form validation ready

### 5️⃣ **Campaign Details**
- Real-time metrics display
- Engagement graph placeholder
- Proof & verification section
- Activity log with timestamps

### 6️⃣ **Advertiser Wallet**
- Balance display with gradient card
- Add funds interface
- Payment methods (UPI, Card, Crypto)
- Transaction history table

### 7️⃣ **Developer Dashboard**
- Earnings overview (Today / Week / Total)
- Active ads counter
- Verification status indicator
- Signal activity graph

### 8️⃣ **Integration Page**
- JavaScript ad code generator
- iFrame integration option
- Copy-to-clipboard functionality
- Video/Reel submission form

### 9️⃣ **Verification & Proof**
- Uploaded content list
- Status indicators (Scanning / Verified / Failed)
- Animated status dots
- Timestamped submission logs

### 🔟 **Developer Wallet**
- Available balance for withdrawal
- Withdrawal request form
- Payment methods (Bank / UPI / Crypto)
- Withdrawal history tracking

### 1️⃣1️⃣ **Activity & Signal Logs**
- Unified activity feed
- Filter by date/campaign
- Icon-based activity types
- Transparent audit trail

### 1️⃣2️⃣ **Admin Panel**
- Platform overview stats
- User management table
- Campaign approval workflow
- Manual verification override
- Wallet control dashboard
- Platform settings configuration
- Abuse detection flags

### 1️⃣3️⃣ **Support & System Info**
- How DarkSignals works
- Rules & policies documentation
- Contact/support ticket form
- System status indicators

---

## 🎨 Design System

### Color Palette
```css
--bg-primary: #0a0a0f        /* Deep space black */
--bg-secondary: #12121a      /* Midnight blue */
--bg-card: rgba(20,20,30,0.6) /* Glass card background */
--accent-blue: #4da6ff       /* Signal blue */
--accent-purple: #a855f7     /* Neon purple */
--accent-green: #10b981      /* Success green */
--accent-red: #ef4444        /* Alert red */
```

### UI Components
- **Glass Cards** - Frosted glass effect with blur
- **Glow Borders** - Subtle neon borders on hover
- **Signal Meter** - Custom progress bar with gradient fill
- **Stepper** - Multi-step form navigation
- **Toast Notifications** - Slide-in alerts
- **Skeleton Loaders** - Loading state placeholders
- **Modal Overlays** - Backdrop blur modals

### Typography
- **Font**: Inter, system fonts fallback
- **Headings**: 800 weight, gradient text
- **Body**: 400-600 weight, optimized line-height

---

## 🚀 Quick Start

### Option 1: Direct Deployment
```bash
# Clone the repository
git clone https://github.com/jithinrajrk147-glitch/darksignals-platform.git

# Open index.html in browser
open index.html
```

### Option 2: GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select `main` branch
4. Save and visit your GitHub Pages URL

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Visit http://localhost:8000
```

---

## 🔧 Backend Integration Guide

### Authentication Endpoints
```javascript
// Replace mock functions with API calls

async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    // Navigate to dashboard
}

async function register(userData) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    // Handle response
}
```

### Campaign Management
```javascript
// Create campaign
POST /api/campaigns
{
    "name": "Summer Launch",
    "platform": "youtube",
    "videoUrl": "https://...",
    "objective": "views",
    "budget": 2400
}

// Get campaigns
GET /api/campaigns?status=live&page=1

// Update campaign
PATCH /api/campaigns/:id
{
    "status": "paused"
}
```

### Wallet Operations
```javascript
// Get balance
GET /api/wallet/balance

// Add funds
POST /api/wallet/deposit
{
    "amount": 2000,
    "method": "upi"
}

// Request withdrawal
POST /api/wallet/withdraw
{
    "amount": 1500,
    "method": "bank_transfer"
}
```

### Verification System
```javascript
// Submit content
POST /api/verification/submit
{
    "platform": "youtube",
    "url": "https://youtube.com/watch?v=...",
    "type": "video"
}

// Check status
GET /api/verification/:id

// Webhook callback
POST /api/webhooks/verification
{
    "verificationId": "...",
    "status": "verified",
    "proof": "..."
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) {
    /* Single column layouts */
    /* Collapsible sidebar */
    /* Stacked cards */
}

@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet optimizations */
}

@media (min-width: 1025px) {
    /* Desktop full experience */
}
```

---

## 🎯 User Flows

### Advertiser Journey
1. **Landing** → Select "Advertiser" role
2. **Register** → Create account with email
3. **Dashboard** → View overview and signal strength
4. **Create Campaign** → 5-step activation flow
5. **Monitor** → Track real-time metrics
6. **Wallet** → Add funds and manage budget

### Developer Journey
1. **Landing** → Select "Developer" role
2. **Register** → Create publisher account
3. **Dashboard** → View earnings overview
4. **Integration** → Get ad code
5. **Submit Content** → Upload videos for verification
6. **Earn** → Track earnings and withdraw

### Admin Journey
1. **Login** → Admin credentials
2. **Overview** → Platform statistics
3. **Review Campaigns** → Approve/reject
4. **Manage Users** → View all accounts
5. **Verification** → Manual override
6. **Settings** → Configure platform

---

## 🔐 Security Considerations

### Frontend (Current Implementation)
- Input validation ready
- XSS prevention via proper escaping
- CSRF token placeholders
- Secure password input fields

### Backend Integration Required
- JWT token authentication
- Rate limiting on API endpoints
- SQL injection prevention
- File upload validation
- Payment gateway encryption
- Webhook signature verification

---

## 🎨 Customization

### Change Brand Colors
```css
:root {
    --accent-blue: #YOUR_COLOR;
    --accent-purple: #YOUR_COLOR;
}
```

### Modify Logo
```javascript
// Update in HTML
<div class="logo">YourBrand</div>
```

### Add New Pages
```javascript
// 1. Add HTML section
<div id="new-page" class="hidden">
    <!-- Your content -->
</div>

// 2. Add navigation function
function showNewPage() {
    showPage('new-page');
}

// 3. Add sidebar link
<a href="#" onclick="showNewPage()">New Page</a>
```

---

## 📊 Analytics Integration

### Google Analytics
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Chart.js for Graphs
```html
<!-- Add before </body> -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
// Replace chart placeholders with real charts
const ctx = document.getElementById('myChart');
new Chart(ctx, {
    type: 'line',
    data: { /* your data */ }
});
</script>
```

---

## 🐛 Known Limitations

- **Single File**: All code in one HTML file (intentional for easy deployment)
- **Mock Data**: Uses placeholder data until backend connected
- **No Persistence**: Data resets on page reload (needs backend)
- **Chart Placeholders**: Requires Chart.js or similar for real graphs
- **Payment Gateway**: UI only, needs Stripe/Razorpay integration

---

## 🚀 Deployment Options

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=.
```

### AWS S3 + CloudFront
```bash
aws s3 sync . s3://your-bucket --acl public-read
```

### Docker
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
```

---

## 📝 License

MIT License - feel free to use for commercial projects

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/jithinrajrk147-glitch/darksignals-platform/issues)
- **Email**: jithinrajrk147@gmail.com

---

## 🎉 Credits

Built by **Jithinraj R.K** with ❤️ using pure HTML/CSS/JavaScript

**Tech Stack:**
- HTML5
- CSS3 (Glassmorphism, Animations)
- Vanilla JavaScript (ES6+)
- Zero external dependencies

---

## 🔮 Roadmap

- [ ] Backend API integration
- [ ] Real-time WebSocket updates
- [ ] Chart.js integration for analytics
- [ ] Payment gateway (Stripe/Razorpay)
- [ ] Email notification system
- [ ] Advanced filtering and search
- [ ] Export reports (PDF/CSV)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle (optional)
- [ ] Progressive Web App (PWA)

---

**⭐ Star this repo if you find it useful!**

**🔗 Live Demo:** [GitHub Pages URL will be here]

**📦 Repository:** https://github.com/jithinrajrk147-glitch/darksignals-platform
