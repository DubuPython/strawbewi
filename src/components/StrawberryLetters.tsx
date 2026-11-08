import { useState } from 'react';
import { STRAWBERRY_LETTERS } from '../data/letters';
import type { StrawberryLetter } from '../types';

export default function StrawberryLetters() {
  const [selectedLetter, setSelectedLetter] = useState<StrawberryLetter | null>(null);
  const [openedSeeds, setOpenedSeeds] = useState<number[]>([]);
  const [hoveredSeed, setHoveredSeed] = useState<number | null>(null);

  // 12 Seeds coordinates (percentage x, y across the strawberry face)
  // Perfectly mapped to the plump heart contours of a real strawberry
  const SEED_COORDS = [
    // Top Row (3 seeds across broad shoulders)
    { x: 34, y: 34, tilt: -14 },
    { x: 50, y: 31, tilt: 0 },
    { x: 66, y: 34, tilt: 14 },
    // Mid-Upper Row (4 seeds across widest plump belly)
    { x: 25, y: 45, tilt: -20 },
    { x: 41, y: 44, tilt: -6 },
    { x: 59, y: 44, tilt: 6 },
    { x: 75, y: 45, tilt: 20 },
    // Mid-Lower Row (3 seeds tapering inward)
    { x: 33, y: 58, tilt: -12 },
    { x: 50, y: 57, tilt: 0 },
    { x: 67, y: 58, tilt: 12 },
    // Bottom Row (2 seeds near the rounded tip)
    { x: 42, y: 72, tilt: -8 },
    { x: 58, y: 72, tilt: 8 },
  ];

  const handleOpenLetter = (letter: StrawberryLetter) => {
    setSelectedLetter(letter);
    if (!openedSeeds.includes(letter.id)) {
      setOpenedSeeds((prev) => [...prev, letter.id]);
    }
  };

  const handleNext = () => {
    if (!selectedLetter) return;
    const currentIndex = STRAWBERRY_LETTERS.findIndex((l) => l.id === selectedLetter.id);
    const nextIndex = (currentIndex + 1) % STRAWBERRY_LETTERS.length;
    handleOpenLetter(STRAWBERRY_LETTERS[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedLetter) return;
    const currentIndex = STRAWBERRY_LETTERS.findIndex((l) => l.id === selectedLetter.id);
    const prevIndex = (currentIndex - 1 + STRAWBERRY_LETTERS.length) % STRAWBERRY_LETTERS.length;
    handleOpenLetter(STRAWBERRY_LETTERS[prevIndex]);
  };

  return (
    <section className="strawberry-letters-section" id="strawberry-letters">
      <div className="section-header">
        <h2 className="cursive section-title">🍓 Letters For Her</h2>
        <p className="section-subtitle">
          Every golden seed on this ripe strawberry holds a heartfelt letter. Tap any seed to unfold it!
        </p>
        <div className="seeds-opened-badge cursive">
          <span>💌 Letters Read: </span>
          <b>{openedSeeds.length}</b> / {STRAWBERRY_LETTERS.length}
        </div>
      </div>

      <div className="strawberry-stage">
        <div className="giant-strawberry-wrap">
          {/* Authentic Botanical Strawberry Silhouette SVG */}
          <svg
            viewBox="0 0 460 540"
            className="strawberry-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Rich 3D Strawberry Flesh Shading */}
              <radialGradient id="strawberryFlesh" cx="36%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="30%" stopColor="#e60039" />
                <stop offset="70%" stopColor="#ba0029" />
                <stop offset="90%" stopColor="#80001a" />
                <stop offset="100%" stopColor="#4d0010" />
              </radialGradient>

              {/* Subsurface Warm Glow */}
              <radialGradient id="strawberryWarmth" cx="44%" cy="30%" r="48%">
                <stop offset="0%" stopColor="#ff758f" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ff1447" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e60039" stopOpacity="0" />
              </radialGradient>

              {/* Lush Green Calyx Gradient */}
              <linearGradient id="calyxGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#48bb78" />
                <stop offset="50%" stopColor="#2f855a" />
                <stop offset="100%" stopColor="#1c4532" />
              </linearGradient>

              {/* Realistic Soft Drop Shadow */}
              <filter id="berryCastShadow" x="-20%" y="-10%" width="140%" height="135%">
                <feDropShadow dx="0" dy="20" stdDeviation="20" floodColor="rgba(180, 0, 45, 0.3)" />
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(80, 0, 20, 0.35)" />
              </filter>

              {/* Seed Dimple / Pit Gradient */}
              <radialGradient id="seedPit" cx="42%" cy="38%" r="58%">
                <stop offset="0%" stopColor="#45000e" />
                <stop offset="65%" stopColor="#700018" />
                <stop offset="100%" stopColor="#a30024" />
              </radialGradient>

              {/* Golden Seed Gradient */}
              <linearGradient id="seedGold" x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#facc15" />
                <stop offset="75%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              {/* Opened Seed Rose-Gold Gradient */}
              <linearGradient id="seedRoseGold" x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="40%" stopColor="#fda4af" />
                <stop offset="75%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
            </defs>

            {/* 1. TRUE BOTANICAL STRAWBERRY BODY: Wide shoulders, gentle center cleft, plump heart shape, rounded apex */}
            <path
              d="M 230 115
                 C 195 108, 120 112, 85 160
                 C 50 210, 58 285, 92 355
                 C 128 425, 192 485, 222 510
                 C 226 513, 234 513, 238 510
                 C 268 485, 332 425, 368 355
                 C 402 285, 410 210, 375 160
                 C 340 112, 265 108, 230 115 Z"
              fill="url(#strawberryFlesh)"
              filter="url(#berryCastShadow)"
            />

            {/* 2. Subsurface Warm Glow Overlay */}
            <path
              d="M 230 128
                 C 200 122, 136 126, 106 168
                 C 76 212, 82 278, 112 340
                 C 142 402, 198 455, 224 478
                 C 228 481, 232 481, 236 478
                 C 262 455, 318 402, 348 340
                 C 378 278, 384 212, 354 168
                 C 324 126, 260 122, 230 128 Z"
              fill="url(#strawberryWarmth)"
            />

            {/* 3. Fresh Juicy Specular Sheen (Curving over the plump left shoulder) */}
            <path
              d="M 125 175
                 C 105 235, 115 315, 155 375
                 C 160 382, 166 378, 163 370
                 C 128 315, 120 240, 136 180
                 C 138 172, 128 168, 125 175 Z"
              fill="rgba(255, 255, 255, 0.42)"
            />
            {/* Soft highlight along top shoulder */}
            <path
              d="M 175 140
                 C 215 130, 260 132, 295 145
                 C 302 148, 305 140, 298 136
                 C 260 122, 212 120, 170 131
                 C 164 133, 168 142, 175 140 Z"
              fill="rgba(255, 255, 255, 0.35)"
            />

            {/* 4. Natural Strawberry Dimples / Seed Pits */}
            {SEED_COORDS.map((coord, i) => {
              const cx = (coord.x / 100) * 460;
              const cy = (coord.y / 100) * 540;
              return (
                <g key={`pit-${i}`} transform={`rotate(${coord.tilt} ${cx} ${cy})`}>
                  <ellipse cx={cx} cy={cy + 1} rx="14" ry="18" fill="url(#seedPit)" />
                  <ellipse
                    cx={cx}
                    cy={cy + 5}
                    rx="12"
                    ry="15"
                    fill="none"
                    stroke="rgba(255, 130, 160, 0.42)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* 5. Realistic Leaf Crown (Calyx): Spreading horizontally across the shoulders with curved stem */}
            <g className="strawberry-calyx">
              {/* Woody stem */}
              <path
                d="M 224 22
                   C 218 52, 222 84, 226 114
                   C 234 114, 238 52, 234 22 Z"
                fill="#22543d"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              <path
                d="M 226 26 C 223 52, 225 78, 228 110"
                stroke="#68d391"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Center Sepal pointing downward */}
              <path
                d="M 230 114
                   C 218 138, 210 172, 230 190
                   C 250 172, 242 138, 230 114 Z"
                fill="url(#calyxGreen)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Left-most sepal spreading wide across left shoulder */}
              <path
                d="M 224 112
                   C 172 75, 120 95, 82 125
                   C 115 148, 172 142, 224 118 Z"
                fill="url(#calyxGreen)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Right-most sepal spreading wide across right shoulder */}
              <path
                d="M 236 112
                   C 288 75, 340 95, 378 125
                   C 345 148, 288 142, 236 118 Z"
                fill="url(#calyxGreen)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Inner Left Sepal */}
              <path
                d="M 226 114
                   C 182 108, 145 138, 138 174
                   C 170 172, 204 145, 228 120 Z"
                fill="url(#calyxGreen)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Inner Right Sepal */}
              <path
                d="M 234 114
                   C 278 108, 315 138, 322 174
                   C 290 172, 256 145, 232 120 Z"
                fill="url(#calyxGreen)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Leaf veining */}
              <path d="M 225 114 Q 150 112 95 128" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" fill="none" />
              <path d="M 235 114 Q 310 112 365 128" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" fill="none" />
              <path d="M 230 114 L 230 180" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" fill="none" />
            </g>
          </svg>

          {/* 6. 12 Interactive Golden Teardrop Seeds (Touch-Friendly for Mobile & Tablet!) */}
          {STRAWBERRY_LETTERS.map((letter, index) => {
            const coord = SEED_COORDS[index % SEED_COORDS.length];
            const isOpened = openedSeeds.includes(letter.id);
            const isHovered = hoveredSeed === letter.id;

            return (
              <div
                key={letter.id}
                className="strawberry-seed-container"
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: `translate(-50%, -50%) rotate(${coord.tilt}deg)`,
                }}
                onMouseEnter={() => setHoveredSeed(letter.id)}
                onMouseLeave={() => setHoveredSeed(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="seed-tooltip cursive">
                    <span>Seed #{letter.id}</span>
                    <small>{letter.title.split('·')[1] || 'Love note'}</small>
                  </div>
                )}

                {/* Touch-Friendly Seed Button (min 42x42px hitbox) */}
                <button
                  className={`strawberry-seed-btn ${isOpened ? 'opened' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => handleOpenLetter(letter)}
                  title={`Open Seed #${letter.id}: ${letter.title}`}
                  aria-label={`Open letter ${letter.id}`}
                >
                  <svg
                    viewBox="0 0 24 32"
                    className="seed-achene-svg"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Botanical Teardrop Achene */}
                    <path
                      d="M 12 3
                         C 16 10, 21 18, 20 24
                         C 19 29, 15 31, 12 31
                         C 9 31, 5 29, 4 24
                         C 3 18, 8 10, 12 3 Z"
                      fill={isOpened ? 'url(#seedRoseGold)' : 'url(#seedGold)'}
                      stroke={isOpened ? '#be123c' : '#78350f'}
                      strokeWidth="1.2"
                    />
                    {/* Specular Glint */}
                    <ellipse
                      cx="9.5"
                      cy="15"
                      rx="2.2"
                      ry="5.5"
                      fill="rgba(255, 255, 255, 0.75)"
                      transform="rotate(-15 9.5 15)"
                    />
                  </svg>

                  <span className="seed-number-tag cursive">{letter.id}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Love Letter Modal (Fully Responsive for Phones, Tablets & Desktops) */}
      {selectedLetter && (
        <div className="letter-modal-backdrop" onClick={() => setSelectedLetter(null)}>
          <div className="letter-paper" onClick={(e) => e.stopPropagation()}>
            <button
              className="letter-close-btn"
              onClick={() => setSelectedLetter(null)}
              aria-label="Close Letter"
            >
              ×
            </button>

            {/* Vintage Postmark Header */}
            <div className="letter-postmark-row">
              <div className="postmark-left">
                <span className="stamp-icon">🍓</span>
                <div className="postmark-labels">
                  <span className="stamp-title">SPECIAL DELIVERY</span>
                  <span className="stamp-subtitle">STRAWBERRY SEED #{selectedLetter.id}</span>
                </div>
              </div>
              <div className="postmark-circle">
                <span className="postmark-date">AIR MAIL</span>
                <span className="postmark-city">PARIS 💌</span>
              </div>
            </div>

            {/* Letter Content on Vintage Lined Parchment */}
            <div className="letter-body">
              <h3 className="cursive letter-heading">{selectedLetter.title}</h3>
              <p className="cursive letter-text">{selectedLetter.content}</p>
            </div>

            {/* Bottom Controls */}
            <div className="letter-footer">
              <div className="letter-nav-buttons">
                <button className="btn-nav cursive" onClick={handlePrev} title="Previous letter">
                  ← Prev Seed
                </button>
                <span className="seed-indicator cursive">
                  Seed {selectedLetter.id} of {STRAWBERRY_LETTERS.length}
                </span>
                <button className="btn-nav cursive" onClick={handleNext} title="Next letter">
                  Next Seed →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
