import { useState } from 'react';
import { STRAWBERRY_LETTERS } from '../data/letters';
import type { StrawberryLetter } from '../types';

export default function StrawberryLetters() {
  const [selectedLetter, setSelectedLetter] = useState<StrawberryLetter | null>(null);
  const [openedSeeds, setOpenedSeeds] = useState<number[]>([]);
  const [hoveredSeed, setHoveredSeed] = useState<number | null>(null);

  // 12 Seeds coordinates (percentage x, y across the strawberry body)
  // Structured naturally along the curved fruit geometry
  const SEED_COORDS = [
    { x: 36, y: 32, tilt: -12 },
    { x: 50, y: 30, tilt: 0 },
    { x: 64, y: 32, tilt: 12 },
    { x: 26, y: 44, tilt: -18 },
    { x: 42, y: 43, tilt: -6 },
    { x: 58, y: 43, tilt: 6 },
    { x: 74, y: 44, tilt: 18 },
    { x: 32, y: 57, tilt: -14 },
    { x: 50, y: 56, tilt: 0 },
    { x: 68, y: 57, tilt: 14 },
    { x: 42, y: 70, tilt: -8 },
    { x: 58, y: 70, tilt: 8 },
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
    <section className="strawberry-letters-section">
      <div className="section-header">
        <h2 className="cursive section-title">🍓 Letters For Her</h2>
        <p className="section-subtitle">
          Every golden seed on this ripe strawberry holds a heartfelt letter. Tap a seed to read it!
        </p>
        <div className="seeds-opened-badge cursive">
          <span>💌 Letters Unfolded: </span>
          <b>{openedSeeds.length}</b> / {STRAWBERRY_LETTERS.length}
        </div>
      </div>

      <div className="strawberry-stage">
        <div className="giant-strawberry-wrap">
          {/* Main Realistic Strawberry SVG */}
          <svg
            viewBox="0 0 460 560"
            className="strawberry-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Rich 3D Strawberry Skin Radial Gradient */}
              <radialGradient id="berry3DGrad" cx="38%" cy="34%" r="62%">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="35%" stopColor="#e60039" />
                <stop offset="72%" stopColor="#ba0029" />
                <stop offset="92%" stopColor="#80001a" />
                <stop offset="100%" stopColor="#4d0010" />
              </radialGradient>

              {/* Subsurface Warm Glow */}
              <radialGradient id="berrySubsurface" cx="45%" cy="30%" r="45%">
                <stop offset="0%" stopColor="#ff758f" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ff1447" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e60039" stopOpacity="0" />
              </radialGradient>

              {/* Lush Leaf Gradient */}
              <linearGradient id="calyxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#68d391" />
                <stop offset="40%" stopColor="#38a169" />
                <stop offset="85%" stopColor="#22543d" />
                <stop offset="100%" stopColor="#1a365d" />
              </linearGradient>

              {/* Strawberry Soft Cast Shadow */}
              <filter id="realisticShadow" x="-25%" y="-15%" width="150%" height="145%">
                <feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="rgba(180, 0, 45, 0.32)" />
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(80, 0, 20, 0.4)" />
              </filter>

              {/* Seed Dimple / Pit Radial Gradient */}
              <radialGradient id="pitGrad" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#500010" />
                <stop offset="65%" stopColor="#7a001a" />
                <stop offset="100%" stopColor="#ba0029" />
              </radialGradient>

              {/* Golden Achene Seed Gradient */}
              <linearGradient id="seedGrad" x1="20%" y1="15%" x2="80%" y2="85%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#facc15" />
                <stop offset="75%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              {/* Opened Seed Rose-Gold Gradient */}
              <linearGradient id="openedSeedGrad" x1="20%" y1="15%" x2="80%" y2="85%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="40%" stopColor="#fda4af" />
                <stop offset="75%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
            </defs>

            {/* 1. Strawberry Fruit Body (Authentic Botanical Heart Shape with Soft Rounded Apex) */}
            <path
              d="M 230 110
                 C 340 115, 415 200, 395 320
                 C 380 405, 305 485, 245 528
                 C 236 534, 224 534, 215 528
                 C 155 485, 80 405, 65 320
                 C 45 200, 120 115, 230 110 Z"
              fill="url(#berry3DGrad)"
              filter="url(#realisticShadow)"
            />

            {/* 2. Subsurface Warm Glow Overlay */}
            <path
              d="M 230 125
                 C 320 130, 380 205, 365 305
                 C 350 375, 290 445, 235 485
                 C 180 445, 120 375, 105 305
                 C 90 205, 150 130, 230 125 Z"
              fill="url(#berrySubsurface)"
              opacity="0.9"
            />

            {/* 3. Plump Curving Specular Highlights (Fresh Berry Sheen) */}
            <path
              d="M 125 180
                 C 110 240, 120 320, 160 380
                 C 165 388, 172 384, 168 375
                 C 134 320, 125 245, 138 185
                 C 140 176, 128 172, 125 180 Z"
              fill="rgba(255, 255, 255, 0.45)"
            />
            <path
              d="M 175 145
                 C 215 135, 260 138, 295 152
                 C 302 155, 305 147, 298 143
                 C 260 128, 212 125, 170 136
                 C 164 138, 168 147, 175 145 Z"
              fill="rgba(255, 255, 255, 0.35)"
            />

            {/* 4. Natural Strawberry Dimples / Seed Pits */}
            {SEED_COORDS.map((coord, i) => {
              const cx = (coord.x / 100) * 460;
              const cy = (coord.y / 100) * 560;
              return (
                <g key={`pit-${i}`} transform={`rotate(${coord.tilt} ${cx} ${cy})`}>
                  {/* Outer dimple shadow */}
                  <ellipse
                    cx={cx}
                    cy={cy + 1}
                    rx="14"
                    ry="18"
                    fill="url(#pitGrad)"
                  />
                  {/* Inner rim highlight */}
                  <ellipse
                    cx={cx}
                    cy={cy + 5}
                    rx="12"
                    ry="15"
                    fill="none"
                    stroke="rgba(255, 120, 150, 0.45)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* 5. Calyx Crown Leaves (Serrated, organic botanical sepals with natural curl) */}
            <g className="strawberry-calyx">
              {/* Woody stem */}
              <path
                d="M 224 25
                   C 220 55, 222 85, 226 112
                   C 234 112, 236 55, 234 25 Z"
                fill="#276749"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              <path
                d="M 226 28 C 224 55, 226 80, 228 108"
                stroke="#68d391"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Center Sepal */}
              <path
                d="M 230 110
                   C 218 135, 210 168, 230 185
                   C 250 168, 242 135, 230 110 Z"
                fill="url(#calyxGrad)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Left-most drooping sepal */}
              <path
                d="M 222 108
                   C 175 75, 130 95, 95 125
                   C 125 145, 175 140, 222 115 Z"
                fill="url(#calyxGrad)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Right-most drooping sepal */}
              <path
                d="M 238 108
                   C 285 75, 330 95, 365 125
                   C 335 145, 285 140, 238 115 Z"
                fill="url(#calyxGrad)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Left inner sepal */}
              <path
                d="M 224 110
                   C 185 105, 150 135, 145 170
                   C 175 168, 205 142, 226 116 Z"
                fill="url(#calyxGrad)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Right inner sepal */}
              <path
                d="M 236 110
                   C 275 105, 310 135, 315 170
                   C 285 168, 255 142, 234 116 Z"
                fill="url(#calyxGrad)"
                stroke="#1c4532"
                strokeWidth="1.5"
              />
              {/* Leaf Vein highlights */}
              <path d="M 225 112 Q 155 110 110 128" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 235 112 Q 305 110 350 128" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 230 112 L 230 175" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
            </g>
          </svg>

          {/* 6. Interactive Teardrop Seeds (Achenes inside Pits) */}
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

                {/* Seed Button */}
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
                    {/* Realistic botanical teardrop seed shape */}
                    <path
                      d="M 12 3
                         C 16 10, 21 18, 20 24
                         C 19 29, 15 31, 12 31
                         C 9 31, 5 29, 4 24
                         C 3 18, 8 10, 12 3 Z"
                      fill={isOpened ? 'url(#openedSeedGrad)' : 'url(#seedGrad)'}
                      stroke={isOpened ? '#be123c' : '#78350f'}
                      strokeWidth="1.2"
                    />
                    {/* Specular Glint */}
                    <ellipse
                      cx="9.5"
                      cy="15"
                      rx="2.2"
                      ry="5.5"
                      fill="rgba(255, 255, 255, 0.7)"
                      transform="rotate(-15 9.5 15)"
                    />
                  </svg>

                  {/* Seed Number badge */}
                  <span className="seed-number-tag cursive">{letter.id}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Realistic Love Letter Reading Modal */}
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

            {/* Letter Body on Lined Parchment */}
            <div className="letter-body">
              <h3 className="cursive letter-heading">{selectedLetter.title}</h3>
              <p className="cursive letter-text">{selectedLetter.content}</p>
            </div>

            {/* Bottom Controls */}
            <div className="letter-footer">
              <div className="letter-nav-buttons">
                <button className="btn-nav cursive" onClick={handlePrev} title="Previous letter">
                  ← Previous Seed
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
