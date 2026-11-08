import { useState } from 'react';
import DefenseLetter from './DefenseLetter';
import BirthdayCard from './BirthdayCard';
import { LETTERS } from '../data/letters';
import type { LetterId } from '../types';

interface CabinetPageProps {
  onBackToGarden: () => void;
}

export default function CabinetPage({ onBackToGarden }: CabinetPageProps) {
  const [openLetterId, setOpenLetterId] = useState<LetterId | null>(null);

  const handleCloseLetter = () => setOpenLetterId(null);

  return (
    <main className="cabinet-page-container">
      {/* Decorative ambient background orbs */}
      <div className="cabinet-ambient-glow" />

      {/* Top Breadcrumb Bar */}
      <div className="cabinet-header-bar">
        <button
          className="cabinet-return-btn cursive"
          onClick={onBackToGarden}
          title="Return to the flower field"
        >
          ← Back to Flower Garden 🌸
        </button>
      </div>

      {openLetterId === 'defense' ? (
        <section className="cabinet-letter-stage">
          <button
            className="cabinet-drawer-back-btn cursive"
            onClick={handleCloseLetter}
            title="Return to cabinet drawers"
          >
            ← Back to Cabinet Drawers
          </button>
          <div className="cabinet-letter-card">
            <DefenseLetter
              autoStart
              finishLabel="Back to Cabinet Drawers 🗄️"
              onFinish={handleCloseLetter}
            />
          </div>
        </section>
      ) : openLetterId === 'birthday' ? (
        <section className="cabinet-letter-stage">
          <button
            className="cabinet-drawer-back-btn cursive"
            onClick={handleCloseLetter}
            title="Return to cabinet drawers"
          >
            ← Back to Cabinet Drawers
          </button>
          <div className="cabinet-letter-card">
            <BirthdayCard />
          </div>
        </section>
      ) : (
        <section className="cabinet-room-stage">
          <div className="cabinet-room-header">
            <h1 className="cursive cabinet-page-title">The Letter Cabinet 🗄️</h1>
            <p className="cabinet-page-subtitle">
              A private collection of keepsake letters and memories, kept safe just for you.
            </p>
          </div>

          <div className="wooden-cabinet-wrapper">
            {/* The Wooden Letter Cabinet */}
            <div className="wooden-cabinet">
              <div className="cabinet-top-trim" />
              <div className="cabinet-drawers-container">
                {LETTERS.map((letter) => (
                  <button
                    key={letter.id}
                    className="cabinet-drawer-row"
                    onClick={() => setOpenLetterId(letter.id)}
                    title={`Open: ${letter.title}`}
                  >
                    <span className="drawer-handle" />
                    <span className="drawer-icon">{letter.emoji}</span>
                    <div className="drawer-info">
                      <b className="cursive drawer-title">{letter.title}</b>
                      <small className="drawer-hint">{letter.hint}</small>
                    </div>
                    <span className="drawer-chevron">→</span>
                  </button>
                ))}
              </div>
              <div className="cabinet-bottom-trim" />
            </div>

            <p className="cursive cabinet-tap-hint">
              Tap a wooden drawer above to unlock and read your special letter ✨
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
