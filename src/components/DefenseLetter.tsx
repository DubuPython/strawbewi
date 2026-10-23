import { useEffect, useState } from 'react';
import Envelope from './Envelope';
import Bouquet from './Bouquet';
import { DEFENSE_MESSAGE } from '../data/letters';
import type { DefenseStage } from '../types';

const READ_MS = 5500; // how long the letter stays open
const TUCK_MS = 1500; // letter slides back, envelope closes
const AUTO_OPEN_MS = 350;

const NEXT: Partial<Record<DefenseStage, [DefenseStage, number]>> = {
  reading: ['tucking', READ_MS],
  tucking: ['bouquet', TUCK_MS],
};

interface Props {
  /** Open the envelope by itself (used when replaying from the cabinet). */
  autoStart?: boolean;
  finishLabel: string;
  onFinish: () => void;
}

/** envelope → letter → tucked back in → bouquet. Used on first load and from the cabinet. */
export default function DefenseLetter({ autoStart = false, finishLabel, onFinish }: Props) {
  const [stage, setStage] = useState<DefenseStage>('envelope');

  useEffect(() => {
    const step: [DefenseStage, number] | undefined =
      stage === 'envelope' ? (autoStart ? ['reading', AUTO_OPEN_MS] : undefined) : NEXT[stage];
    if (!step) return;
    const t = window.setTimeout(() => setStage(step[0]), step[1]);
    return () => window.clearTimeout(t);
  }, [stage, autoStart]);

  const onEnvelopeClick = () => {
    if (stage === 'envelope') setStage('reading');
    else if (stage === 'reading') setStage('tucking');
  };

  if (stage === 'bouquet') {
    return (
      <div className="sequence">
        <Bouquet />
        <h2 className="cursive title sub">For you hehehe 💐</h2>
        <button className="btn yes later" onClick={onFinish}>{finishLabel}</button>
      </div>
    );
  }

  const waiting = stage === 'envelope' && !autoStart;

  return (
    <div className="sequence">
      <h1 className="cursive title">{waiting ? 'You’ve got mail! 💌' : 'Para sa defense mo 🎓'}</h1>
      <div className="env-wrap">
        <Envelope open={stage === 'reading'} seal="🎓" onClick={onEnvelopeClick}>
          <p className="cursive msg">{DEFENSE_MESSAGE}</p>
        </Envelope>
      </div>
      {waiting && <p className="hint">Tap to open me</p>}
    </div>
  );
}
