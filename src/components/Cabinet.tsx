import { useState } from 'react';
import DefenseLetter from './DefenseLetter';
import BirthdayCard from './BirthdayCard';
import type { LetterId, LetterMeta } from '../types';

export default function Cabinet({ letters }: { letters: LetterMeta[] }) {
  const [openId, setOpenId] = useState<LetterId | null>(null);
  const close = () => setOpenId(null);

  if (openId === 'defense') {
    return (
      <div className="cabinet-active-view">
        <button className="cabinet-nav-back cursive" onClick={close} title="Return to letter cabinet">
          ← Back to Cabinet
        </button>
        <DefenseLetter autoStart finishLabel="Back to Cabinet 🗄️" onFinish={close} />
      </div>
    );
  }

  if (openId === 'birthday') {
    return (
      <div className="cabinet-active-view">
        <button className="cabinet-nav-back cursive" onClick={close} title="Return to letter cabinet">
          ← Back to Cabinet
        </button>
        <BirthdayCard />
      </div>
    );
  }

  return (
    <div className="cabinet-main-view">
      <h1 className="cursive title cabinet-title">Letters for Sheena 🍓🌸💖</h1>
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
      <p className="hint cursive cabinet-hint">Tap a drawer to open a special letter</p>
    </div>
  );
}
