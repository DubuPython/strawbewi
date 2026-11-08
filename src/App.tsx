import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SpotifyPlayer from './components/SpotifyPlayer';
import FlowerHero from './components/FlowerHero';
import BulletinBoard from './components/BulletinBoard';
import StrawberryLetters from './components/StrawberryLetters';
import CabinetPage from './components/CabinetPage';

type Page = 'garden' | 'cabinet';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return window.location.hash === '#cabinet' ? 'cabinet' : 'garden';
  });

  // Keep page in sync with hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const page = window.location.hash === '#cabinet' ? 'cabinet' : 'garden';
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page === 'cabinet' ? '#cabinet' : '#garden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="app-root-layout">
        {/* Top Glassmorphism Navigation Bar */}
        <Navbar currentPage={currentPage} onNavigate={navigateTo} />

        {/* Music Player: Side button (Persists across pages so music keeps playing) */}
        <SpotifyPlayer />

        {/* PAGE 1: Flower Garden Landing Page */}
        {currentPage === 'garden' ? (
          <main className="landing-container">
            {/* Section 1: Optimized 60 FPS Field of Carnations & Peonies */}
            <FlowerHero />

            {/* Section 2: Corkboard Memory Board with Polaroid Camera */}
            <BulletinBoard />

            {/* Section 3: Authentic Botanical Strawberry Letters */}
            <StrawberryLetters />

            {/* Gateway Banner to the Letter Cabinet Page */}
            <section className="cabinet-gateway-section">
              <div className="cabinet-gateway-card">
                <div className="gateway-icon">🗄️</div>
                <div className="gateway-content">
                  <h3 className="cursive gateway-title">Looking for the Letter Cabinet?</h3>
                  <p className="gateway-text">
                    Open your personal letter archive with the Goodluck sa Defense letter & Birthday card!
                  </p>
                </div>
                <button
                  className="gateway-btn cursive"
                  onClick={() => navigateTo('cabinet')}
                  title="Go to Letter Cabinet page"
                >
                  Enter Cabinet Page →
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
              <p className="cursive footer-note">Made with boundless love & stardust 🍓🌸✨</p>
            </footer>
          </main>
        ) : (
          /* PAGE 2: Dedicated Letter Cabinet Page */
          <CabinetPage onBackToGarden={() => navigateTo('garden')} />
        )}
      </div>
    </ThemeProvider>
  );
}
