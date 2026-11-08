import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import SpotifyPlayer from './components/SpotifyPlayer';
import FlowerHero from './components/FlowerHero';
import BulletinBoard from './components/BulletinBoard';
import StrawberryLetters from './components/StrawberryLetters';
import Cabinet from './components/Cabinet';
import { LETTERS } from './data/letters';

export default function App() {
  const [showCabinetModal, setShowCabinetModal] = useState(false);

  return (
    <ThemeProvider>
      <div className="landing-container">
        {/* Top Right: Theme Switcher (Pink Fantasy vs Space/Astrology) */}
        <ThemeToggle />

        {/* Side Button: Spotify Music Player (Not full segment) */}
        <SpotifyPlayer />

        {/* Section 1: Field of Carnations & Peonies Hero */}
        <FlowerHero />

        {/* Section 2: Bulletin Board with Polaroid Camera on the side */}
        <BulletinBoard />

        {/* Section 3: Letters For Her inside a Big Strawberry where every seed is a letter */}
        <StrawberryLetters />

        {/* Floating / Bottom Link to Special Letter Cabinet (Defense & Birthday) */}
        <footer className="landing-footer">
          <p className="cursive footer-note">Made with boundless love & stardust 🍓🌸✨</p>
          <button
            className="cabinet-shortcut-btn cursive"
            onClick={() => setShowCabinetModal(true)}
          >
            🗄️ Open Special Letter Cabinet
          </button>
        </footer>

        {/* Special Cabinet Modal */}
        {showCabinetModal && (
          <div className="overlay" onClick={() => setShowCabinetModal(false)}>
            <button
              className="close"
              aria-label="Close cabinet"
              onClick={() => setShowCabinetModal(false)}
            >
              ×
            </button>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <Cabinet letters={LETTERS} />
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
