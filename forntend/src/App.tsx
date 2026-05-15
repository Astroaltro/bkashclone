import React, { useState } from 'react';
import './App.css'; 
import { 
  Search, Origami, ArrowRightLeft, Smartphone, 
  HandCoins, ShoppingBag, PlusCircle, Lightbulb, 
  PiggyBank, Landmark, ChevronDown, Home, 
  WalletCards, ScanLine, Inbox, UserCircle2, LogOut
} from 'lucide-react';

const BkashUI: React.FC = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<{name: string, phone: string} | null>(null);

  // --- AUTHENTICATION HANDLERS ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    const payload = isLoginMode ? { phone, password } : { phone, password, name };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLoginMode) {
        // Login Success: Save token and user info, then show main app
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Registration Success: Switch to login mode
        setIsLoginMode(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setPhone('');
    setPassword('');
  };

  // --- STATIC UI DATA ---
  const menuItems = [
    { icon: <ArrowRightLeft size={28} color="#db2777" />, label: 'Send Money' },
    { icon: <Smartphone size={28} color="#22c55e" />, label: 'Mobile Recharge' },
    { icon: <HandCoins size={28} color="#14b8a6" />, label: 'Cash Out' },
    { icon: <ShoppingBag size={28} color="#fb923c" />, label: 'Payment' },
    { icon: <PlusCircle size={28} color="#9333ea" />, label: 'Add Money' },
    { icon: <Lightbulb size={28} color="#4b5563" />, label: 'Pay Bill' },
    { icon: <PiggyBank size={28} color="#db2777" />, label: 'Savings' },
    { icon: <Landmark size={28} color="#b45309" />, label: 'Loan' },
  ];

  const quickFeatures = [
    { name: user?.name || 'User', color: '#22c55e' },
    { name: '01772...', color: '#ec4899' },
    { name: '017417...', color: '#ec4899' },
  ];

  // =====================================================================
  // 1. RENDER LOGIN/REGISTER SCREEN (If not authenticated)
  // =====================================================================
  if (!isAuthenticated) {
    return (
      <div className="app-wrapper">
        <div className="mobile-container" style={{ padding: '2rem', justifyContent: 'center', backgroundColor: 'white' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#e2136e', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Origami size={40} color="white" />
            </div>
            <h2 style={{ color: '#e2136e', margin: 0, fontSize: '1.5rem' }}>
              {isLoginMode ? 'Log In' : 'Create Account'}
            </h2>
          </div>
          
          {/* Error / Success Messages */}
          {error && (
            <div style={{ 
              color: error.includes('successful') ? '#15803d' : '#b91c1c', 
              backgroundColor: error.includes('successful') ? '#dcfce7' : '#fee2e2',
              padding: '0.75rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem', fontSize: '0.875rem' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLoginMode && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
              />
            )}
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
            />
            <button 
              type="submit" 
              style={{ backgroundColor: '#e2136e', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              {isLoginMode ? 'Login' : 'Register'}
            </button>
          </form>

          <button 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} 
            style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontWeight: '500' }}
          >
            {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  // =====================================================================
  // 2. RENDER MAIN APP SCREEN (If authenticated)
  // =====================================================================
  return (
    <div className="app-wrapper">
      <div className="mobile-container">
        
        {/* Header Section */}
        <div className="header-section">
          <div className="header-top">
            <div className="profile-info">
              <div className="profile-img-container">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Default'}`} 
                  alt="Profile" 
                />
              </div>
              <div className="profile-text">
                {/* Dynamically display logged in user's name */}
                <span className="profile-name">{user?.name}</span>
                <button className="balance-btn">
                  <span className="balance-icon">৳</span>
                  <span className="balance-text">Tap for Balance</span>
                </button>
              </div>
            </div>

            <div className="header-icons">
              <button className="icon-btn">
                <Search size={20} color="#4b5563" />
              </button>
              {/* Logout Button */}
              <button className="icon-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} color="#e2136e" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="main-content">
          
          <div className="grid-menu">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-item">
                <div className="menu-icon-container">
                  {item.icon}
                </div>
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="see-more-container">
            <button className="see-more-btn">
              See More <ChevronDown size={16} />
            </button>
          </div>

          <div className="promo-banner">
            <div className="banner-left">
               <span className="banner-text-small">প্রথম</span>
               <span className="banner-text-large">ডিপিএস</span>
               <span className="banner-text-small">খুললেই</span>
            </div>
            <div className="banner-right">
              <div className="banner-price-row">
                <span className="banner-price-main">২৬০০</span>
                <span className="banner-price-sub">৳২০০</span>
              </div>
              <span className="banner-disclaimer">বোনাস রিওয়ার্ড পয়েন্ট | পেমেন্ট কুপন*</span>
              <button className="banner-tap-btn">ট্যাপ করুন</button>
            </div>
          </div>

          <div className="quick-features-section">
            <h3 className="section-title">Quick Features</h3>
            <div className="features-scroll">
              {quickFeatures.map((feat, idx) => (
                <div key={idx} className="feature-item">
                  <UserCircle2 size={20} color={feat.color} />
                  <span className="feature-name">{feat.name}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="nav-item active">
            <Home size={24} color="#e2136e" fill="#e2136e" />
            <span className="nav-label">Home</span>
          </button>
          <button className="nav-item">
            <WalletCards size={24} />
            <span className="nav-label">My bKash</span>
          </button>
          
          <button className="scan-qr-btn">
            <div className="scan-qr-circle">
              <ScanLine size={24} />
            </div>
            <span className="nav-label">Scan QR</span>
          </button>

          <button className="nav-item">
            <Inbox size={24} />
            <span className="nav-label">Inbox</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BkashUI;