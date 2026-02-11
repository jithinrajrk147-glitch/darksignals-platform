# 🔧 Backend Integration Guide

Complete guide for connecting DarkSignals frontend to your backend API.

---

## 📋 Table of Contents

1. [API Architecture](#api-architecture)
2. [Authentication](#authentication)
3. [Campaign Management](#campaign-management)
4. [Wallet & Payments](#wallet--payments)
5. [Verification System](#verification-system)
6. [Analytics & Metrics](#analytics--metrics)
7. [Admin Operations](#admin-operations)
8. [WebSocket Real-time Updates](#websocket-real-time-updates)

---

## 🏗️ API Architecture

### Recommended Stack
- **Backend:** Node.js + Express / Python + FastAPI / Go + Gin
- **Database:** PostgreSQL (primary) + Redis (cache)
- **File Storage:** AWS S3 / Cloudinary
- **Payment:** Stripe / Razorpay
- **Real-time:** Socket.io / WebSocket

### Base URL Structure
```
Production:  https://api.darksignals.io/v1
Development: http://localhost:3000/v1
```

---

## 🔐 Authentication

### 1. Register User

**Frontend Code (Replace in index.html):**
```javascript
async function register() {
    const name = document.querySelector('#register-form input[type="text"]').value;
    const email = document.querySelector('#register-form input[type="email"]').value;
    const password = document.querySelector('#register-form input[type="password"]').value;
    const role = document.getElementById('role-select').value;
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showToast('Account created successfully!', 'success');
            
            // Navigate to appropriate dashboard
            currentUser = data.user;
            currentRole = data.user.role;
            
            setTimeout(() => {
                if (currentRole === 'advertiser') {
                    showPage('advertiser-dashboard');
                } else {
                    showPage('developer-dashboard');
                }
            }, 500);
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Registration error:', error);
    }
}
```

**Backend Endpoint (Node.js + Express):**
```javascript
// POST /v1/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false
        });
        
        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Send verification email
        await sendVerificationEmail(user.email, user._id);
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
```

### 2. Login User

**Frontend Code:**
```javascript
async function login() {
    const email = document.querySelector('#login-form input[type="email"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            currentUser = data.user;
            currentRole = data.user.role;
            
            showToast('Login successful!', 'success');
            
            setTimeout(() => {
                if (currentRole === 'advertiser') {
                    showPage('advertiser-dashboard');
                } else if (currentRole === 'developer') {
                    showPage('developer-dashboard');
                } else if (currentRole === 'admin') {
                    showPage('admin-dashboard');
                }
            }, 500);
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}
```

**Backend Endpoint:**
```javascript
// POST /v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
```

### 3. Auth Middleware

**Backend Middleware:**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
```

---

## 🎯 Campaign Management

### 1. Create Campaign

**Frontend Code:**
```javascript
async function createCampaign(campaignData) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(campaignData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Campaign created successfully!', 'success');
            showAdvertiserPage('campaigns');
            loadCampaigns(); // Refresh campaign list
        } else {
            showToast(data.message || 'Failed to create campaign', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
}
```

**Backend Endpoint:**
```javascript
// POST /v1/campaigns
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, platform, videoUrl, objective, budget } = req.body;
        
        // Validate
        if (!name || !platform || !objective || !budget) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create campaign
        const campaign = await Campaign.create({
            userId: req.userId,
            name,
            platform,
            videoUrl,
            objective,
            budget,
            status: 'review', // Pending admin approval
            createdAt: new Date()
        });
        
        // Notify admin
        await notifyAdmin('new_campaign', campaign);
        
        res.status(201).json({
            message: 'Campaign created',
            campaign: {
                id: campaign._id,
                name: campaign.name,
                status: campaign.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
```

### 2. Get Campaigns

**Frontend Code:**
```javascript
async function loadCampaigns(status = 'all', page = 1) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(
            `https://api.darksignals.io/v1/campaigns?status=${status}&page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        
        if (response.ok) {
            renderCampaigns(data.campaigns);
            updatePagination(data.pagination);
        }
    } catch (error) {
        showToast('Failed to load campaigns', 'error');
    }
}

function renderCampaigns(campaigns) {
    const container = document.querySelector('.campaigns-grid');
    
    if (campaigns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <div class="empty-title">No campaigns found</div>
                <button class="btn btn-primary" onclick="showAdvertiserPage('create-campaign')">
                    Create Campaign
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = campaigns.map(campaign => `
        <div class="campaign-card">
            <div class="campaign-preview">
                <span>${getPlatformIcon(campaign.platform)}</span>
            </div>
            <div class="campaign-info">
                <div class="campaign-title">${campaign.name}</div>
                <div class="campaign-meta">
                    <span>${campaign.platform}</span>
                    <span>•</span>
                    <span>${campaign.views || 0} views</span>
                    <span>•</span>
                    <span>$${campaign.spent || 0} spent</span>
                </div>
            </div>
            <div class="campaign-actions">
                <span class="badge badge-${campaign.status}">${campaign.status}</span>
                <button class="btn btn-secondary" onclick="showCampaignDetails('${campaign.id}')">
                    View
                </button>
            </div>
        </div>
    `).join('');
}
```

**Backend Endpoint:**
```javascript
// GET /v1/campaigns
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { status = 'all', page = 1, limit = 10 } = req.query;
        
        const query = { userId: req.userId };
        if (status !== 'all') {
            query.status = status;
        }
        
        const campaigns = await Campaign.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Campaign.countDocuments(query);
        
        res.json({
            campaigns: campaigns.map(c => ({
                id: c._id,
                name: c.name,
                platform: c.platform,
                status: c.status,
                views: c.metrics?.views || 0,
                spent: c.spent || 0,
                createdAt: c.createdAt
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
```

---

## 💰 Wallet & Payments

### 1. Get Wallet Balance

**Frontend Code:**
```javascript
async function loadWalletBalance() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/wallet/balance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.querySelector('.balance-amount').textContent = 
                `$${data.balance.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Failed to load balance');
    }
}
```

**Backend Endpoint:**
```javascript
// GET /v1/wallet/balance
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.userId });
        
        if (!wallet) {
            return res.json({ balance: 0 });
        }
        
        res.json({
            balance: wallet.balance,
            currency: 'USD'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
```

### 2. Add Funds (Stripe Integration)

**Frontend Code:**
```javascript
async function addFunds(amount, paymentMethod) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/wallet/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, paymentMethod })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirect to Stripe checkout
            window.location.href = data.checkoutUrl;
        } else {
            showToast(data.message || 'Payment failed', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
}
```

**Backend Endpoint:**
```javascript
// POST /v1/wallet/deposit
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/deposit', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'DarkSignals Wallet Top-up'
                    },
                    unit_amount: amount * 100 // Convert to cents
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/wallet?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/wallet?canceled=true`,
            metadata: {
                userId: req.userId,
                type: 'deposit'
            }
        });
        
        res.json({
            checkoutUrl: session.url
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment error' });
    }
});

// Webhook handler for Stripe
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Add funds to wallet
            await Wallet.findOneAndUpdate(
                { userId: session.metadata.userId },
                { $inc: { balance: session.amount_total / 100 } },
                { upsert: true }
            );
            
            // Create transaction record
            await Transaction.create({
                userId: session.metadata.userId,
                type: 'deposit',
                amount: session.amount_total / 100,
                status: 'completed',
                paymentId: session.id
            });
        }
        
        res.json({ received: true });
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});
```

---

## ✅ Verification System

### Submit Content for Verification

**Frontend Code:**
```javascript
async function submitForVerification(platform, url) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/verification/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ platform, url })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Submitted for verification', 'success');
            loadVerifications(); // Refresh list
        } else {
            showToast(data.message || 'Submission failed', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
}
```

**Backend Endpoint:**
```javascript
// POST /v1/verification/submit
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { platform, url } = req.body;
        
        // Create verification record
        const verification = await Verification.create({
            userId: req.userId,
            platform,
            url,
            status: 'scanning',
            submittedAt: new Date()
        });
        
        // Queue verification job
        await verificationQueue.add({
            verificationId: verification._id,
            platform,
            url
        });
        
        res.status(201).json({
            message: 'Submitted for verification',
            verificationId: verification._id,
            status: 'scanning'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
```

---

## 📊 Analytics & Metrics

**Frontend Code:**
```javascript
async function loadDashboardStats() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('https://api.darksignals.io/v1/analytics/overview', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            updateStatsCards(data.stats);
            updateSignalMeter(data.signalStrength);
        }
    } catch (error) {
        console.error('Failed to load stats');
    }
}

function updateStatsCards(stats) {
    document.querySelector('[data-stat="campaigns"]').textContent = stats.activeCampaigns;
    document.querySelector('[data-stat="reach"]').textContent = formatNumber(stats.totalReach);
    document.querySelector('[data-stat="engagement"]').textContent = `${stats.engagementRate}%`;
    document.querySelector('[data-stat="budget"]').textContent = `$${stats.activeBudget}`;
}
```

---

## 🔌 WebSocket Real-time Updates

**Frontend Code:**
```javascript
// Add at top of script section
let socket;

function initializeWebSocket() {
    const token = localStorage.getItem('token');
    socket = io('https://api.darksignals.io', {
        auth: { token }
    });
    
    socket.on('campaign_update', (data) => {
        updateCampaignCard(data.campaignId, data.metrics);
        showToast(`Campaign "${data.name}" updated`, 'info');
    });
    
    socket.on('verification_complete', (data) => {
        updateVerificationStatus(data.verificationId, data.status);
        showToast(`Verification ${data.status}`, data.status === 'verified' ? 'success' : 'error');
    });
    
    socket.on('wallet_update', (data) => {
        loadWalletBalance();
    });
}

// Call on login
function login() {
    // ... existing login code ...
    initializeWebSocket();
}
```

**Backend WebSocket Server:**
```javascript
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    socket.join(`user:${socket.userId}`);
    
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
    });
});

// Emit updates
function notifyUser(userId, event, data) {
    io.to(`user:${userId}`).emit(event, data);
}
```

---

## 🚀 Complete Integration Checklist

- [ ] Setup backend server (Node.js/Python/Go)
- [ ] Configure database (PostgreSQL + Redis)
- [ ] Implement authentication endpoints
- [ ] Add JWT token generation
- [ ] Create campaign CRUD endpoints
- [ ] Integrate payment gateway (Stripe/Razorpay)
- [ ] Build verification system
- [ ] Setup file upload (S3/Cloudinary)
- [ ] Implement WebSocket server
- [ ] Add analytics endpoints
- [ ] Create admin endpoints
- [ ] Setup email service (SendGrid/AWS SES)
- [ ] Add rate limiting
- [ ] Implement error logging (Sentry)
- [ ] Setup monitoring (DataDog/New Relic)
- [ ] Write API documentation (Swagger)
- [ ] Add unit tests
- [ ] Setup CI/CD pipeline
- [ ] Configure production environment
- [ ] Deploy backend
- [ ] Update frontend API URLs
- [ ] Test end-to-end flows

---

**Need help? Open an issue on GitHub!**
