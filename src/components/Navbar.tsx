import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentPage: 'garden' | 'cabinet';
  onNavigate: (page: 'garden' | 'cabinet') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="site-navbar">
      <div className="navbar-container">
        {/* Brand / Title */}
        <div
          className="navbar-brand cursive"
          onClick={() => onNavigate('garden')}
          role="button"
          tabIndex={0}
          title="Return to Garden"
        >
          <span className="brand-berry">🍓</span>
          <span className="brand-text">For Sheena</span>
        </div>

        {/* Page Switcher Tabs */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn cursive ${currentPage === 'garden' ? 'active' : ''}`}
            onClick={() => onNavigate('garden')}
            title="Flower Garden Landing Page"
          >
            🌸 Garden
          </button>
          <button
            className={`nav-tab-btn cursive ${currentPage === 'cabinet' ? 'active' : ''}`}
            onClick={() => onNavigate('cabinet')}
            title="Letter Cabinet Dedicated Page"
          >
            🗄️ Letter Cabinet
          </button>
        </nav>

        {/* Theme Toggle (Sun / Moon) */}
        <div className="navbar-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
