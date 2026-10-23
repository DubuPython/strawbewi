import { useState } from 'react';
import DefenseLetter from './DefenseLetter';
import BirthdayCard from './BirthdayCard';
import type { LetterId, LetterMeta } from '../types';

export default function Cabinet({ letters }: { letters: LetterMeta[] }) {
  const [openId, setOpenId] = useState<LetterId | null>(null);
  const close = () => setOpenId(null);

  return (
    <section className="stage">
      <h1 className="cursive title">Letter for Sheenaaa 🗄️</h1>
      <div className="cabinet">
        {letters.map((l) => (
          <button key={l.id} className="drawer" onClick={() => setOpenId(l.id)}>
            <span className="drawer-emoji">{l.emoji}</span>
            <span className="drawer-text">
              <b className="cursive">{l.title}</b>
              <small>{l.hint}</small>
            </span>
          </button>
        ))}
      </div>
      <p className="hint">Tap a drawer to open a letter</p>

      {openId && (
        <div className="overlay" onClick={close}>
          <button className="close" aria-label="Close letter" onClick={close}>×</button>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {openId === 'defense' ? (
              <DefenseLetter autoStart finishLabel="Back to the cabinet 🗄️" onFinish={close} />
            ) : (
              <BirthdayCard />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
