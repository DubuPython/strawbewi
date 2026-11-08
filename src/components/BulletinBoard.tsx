import { useState } from 'react';
import { POLAROID_MEMORIES } from '../data/letters';
import type { PolaroidMemory } from '../types';

export default function BulletinBoard() {
  const [pinnedMemories, setPinnedMemories] = useState<
    (PolaroidMemory & { rot: number; pinColor: string })[]
  >([
    {
      ...POLAROID_MEMORIES[0],
      rot: -4.5,
      pinColor: '#e11d48',
    },
    {
      ...POLAROID_MEMORIES[4],
      rot: 5.2,
      pinColor: '#8b5cf6',
    },
  ]);
  const [nextIndex, setNextIndex] = useState(2);
  const [isFlashing, setIsFlashing] = useState(false);
  const [zoomedMemory, setZoomedMemory] = useState<PolaroidMemory | null>(null);

  const pinColors = ['#e11d48', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6'];

  const handleSnapPhoto = () => {
    // Camera Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 180);

    const memoryToAdd = POLAROID_MEMORIES[nextIndex % POLAROID_MEMORIES.length];
    const rot = Math.round((Math.random() * 16 - 8) * 10) / 10;
    const pinColor = pinColors[Math.floor(Math.random() * pinColors.length)];

    setPinnedMemories((prev) => [
      ...prev,
      {
        ...memoryToAdd,
        rot,
        pinColor,
      },
    ]);
    setNextIndex((prev) => prev + 1);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPinnedMemories((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <section className="bulletin-section">
      {/* Shutter Flash Overlay */}
      <div className={`camera-flash ${isFlashing ? 'active' : ''}`} />

      <div className="section-header">
        <h2 className="cursive section-title">📌 Our Memory Board</h2>
        <p className="section-subtitle">
          Click the Polaroid camera on the side to snap, eject, and pin memories to the board!
        </p>
      </div>

      <div className="bulletin-container">
        {/* Corkboard / Nebula Pinboard */}
        <div className="bulletin-board">
          <div className="board-pin-strip top" />
          <div className="board-pin-strip bottom" />

          {pinnedMemories.length === 0 ? (
            <div className="board-empty-hint cursive">
              <span>📷 Click the camera on the right to pin a memory!</span>
            </div>
          ) : (
            <div className="polaroid-grid">
              {pinnedMemories.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="polaroid-card"
                  style={{
                    transform: `rotate(${item.rot}deg)`,
                  }}
                  onClick={() => setZoomedMemory(item)}
                  title="Click to zoom in"
                >
                  {/* Realistic 3D Pushpin */}
                  <div
                    className="pushpin"
                    style={{ backgroundColor: item.pinColor }}
                  >
                    <span className="pin-highlight" />
                  </div>

                  {/* Remove Button */}
                  <button
                    className="unpin-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(index);
                    }}
                    title="Unpin polaroid"
                    aria-label="Remove polaroid"
                  >
                    ×
                  </button>

                  {/* Polaroid Photo Window */}
                  <div
                    className="polaroid-photo"
                    style={{
                      background: item.image ? '#000' : item.bgGradient,
                    }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.caption} className="polaroid-img" />
                    ) : (
                      <span className="polaroid-emoji">{item.emoji}</span>
                    )}
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <p className="cursive polaroid-caption">{item.caption}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vintage Polaroid Camera Dock */}
        <aside className="camera-dock">
          <button
            className="polaroid-camera-btn"
            onClick={handleSnapPhoto}
            title="Snap Polaroid!"
            aria-label="Snap Polaroid Camera"
          >
            <svg
              viewBox="0 0 120 140"
              className="camera-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="camBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="45%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <radialGradient id="lensGlass" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Camera Body Shadow */}
              <rect x="12" y="22" width="96" height="106" rx="16" fill="rgba(0,0,0,0.18)" />

              {/* Main Body */}
              <rect x="10" y="18" width="100" height="106" rx="14" fill="url(#camBody)" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Top Viewfinder & Flash Hump */}
              <rect x="22" y="8" width="76" height="16" rx="6" fill="#334155" />
              <circle cx="86" cy="16" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <rect x="30" y="12" width="16" height="8" rx="2" fill="#38bdf8" opacity="0.75" />

              {/* Red Shutter Button */}
              <rect x="16" y="24" width="18" height="12" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

              {/* Iconic Vintage Rainbow Stripe */}
              <path d="M 10 74 H 110 V 78 H 10 Z" fill="#ef4444" />
              <path d="M 10 78 H 110 V 82 H 10 Z" fill="#f97316" />
              <path d="M 10 82 H 110 V 86 H 10 Z" fill="#eab308" />
              <path d="M 10 86 H 110 V 90 H 10 Z" fill="#22c55e" />
              <path d="M 10 90 H 110 V 94 H 10 Z" fill="#0ea5e9" />

              {/* Large Camera Lens Housing */}
              <circle cx="60" cy="58" r="30" fill="url(#lensGrad)" stroke="#475569" strokeWidth="3" />
              <circle cx="60" cy="58" r="23" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="60" cy="58" r="17" fill="url(#lensGlass)" />
              {/* Glass Glare */}
              <ellipse cx="53" cy="51" rx="5" ry="3" fill="#ffffff" opacity="0.6" transform="rotate(-30 53 51)" />

              {/* Photo Ejection Mouth */}
              <rect x="24" y="112" width="72" height="6" rx="3" fill="#0f172a" />
            </svg>
            <span className="camera-label cursive">Click to Snap! 📸</span>
          </button>
        </aside>
      </div>

      {/* Full-view Zoom Modal */}
      {zoomedMemory && (
        <div className="zoom-modal-backdrop" onClick={() => setZoomedMemory(null)}>
          <div className="zoom-polaroid-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="zoom-close-btn"
              onClick={() => setZoomedMemory(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div
              className="zoom-photo-box"
              style={{ background: zoomedMemory.image ? '#000' : zoomedMemory.bgGradient }}
            >
              {zoomedMemory.image ? (
                <img src={zoomedMemory.image} alt={zoomedMemory.caption} className="zoom-img" />
              ) : (
                <span className="zoom-emoji">{zoomedMemory.emoji}</span>
              )}
            </div>
            <p className="cursive zoom-caption">{zoomedMemory.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
