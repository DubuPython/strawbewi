import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import Envelope from './Envelope';

const NO_PHRASES = [
  'Bawal tumanggi!', 'Try again!', 'Nope!', 'Di pwede', 'Yes lang pwede',
  'Ayaw mo ba?', 'Bleehh 😝', 'Click Yes na!', 'Makulit ah!', 'No is not an option!',
];
const EMOJIS = ['🍓', '🌸', '💖', '🌺', '✨'];
const PHOTO = '/happy-bidet.jpg';
const FALLBACK = 'https://placehold.co/1280x720/fbcfe8/e11d48?text=Your+Landscape+Picture';
const OPEN_MS = 1600; // envelope opening animation before "Ready kana ba?"

type Step = 'envelope' | 'ask' | 'card';

export default function BirthdayCard() {
  const [step, setStep] = useState<Step>('envelope');
  const [opening, setOpening] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [phrase, setPhrase] = useState(-1);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!opening) return;
    const t = window.setTimeout(() => setStep('ask'), OPEN_MS);
    return () => window.clearTimeout(t);
  }, [opening]);

  const floaters = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        emoji: EMOJIS[i % EMOJIS.length],
        left: Math.random() * 100,
        dur: 6 + Math.random() * 8,
        delay: Math.random() * 6,
      })),
    [],
  );

  const dodge = () => {
    setPhrase((p) => (p + 1) % NO_PHRASES.length);
    setPos({
      x: 20 + Math.random() * Math.max(0, window.innerWidth - 190),
      y: 40 + Math.random() * Math.max(0, window.innerHeight - 120),
    });
  };

  const onImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
  };

  if (step === 'envelope') {
    return (
      <div className="sequence">
        <h1 className="cursive title">You’ve got mail! 💌</h1>
        <div className="env-wrap">
          <Envelope open={opening} seal="🍓" onClick={() => setOpening(true)}>
            <p className="cursive msg">Happy Birthday! 🍓</p>
          </Envelope>
        </div>
        {!opening && <p className="hint">Tap to open me</p>}
      </div>
    );
  }

  if (step === 'ask') {
    return (
      <div className="card">
        <h1 className="cursive flash">Ready kana ba?</h1>
        <div className="row">
          <button className="btn yes" onClick={() => setStep('card')}>Yes</button>
          <button
            className={`btn no ${pos ? 'moved' : ''}`}
            style={pos ? { left: pos.x, top: pos.y } : undefined}
            onPointerEnter={dodge}
            onClick={dodge}
          >
            {phrase < 0 ? 'No' : NO_PHRASES[phrase]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {floaters.map((f, i) => (
        <span
          key={i}
          className="float"
          style={{ left: `${f.left}vw`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
        >
          {f.emoji}
        </span>
      ))}
      <div className="card">
        <div className="frame">
          <span className="deco tl">🌸</span>
          <span className="deco tr">🍓</span>
          <span className="deco br">🌸</span>
          <span className="deco bl">🍓</span>
          <img src={PHOTO} alt="Birthday frame" onError={onImgError} onClick={(e) => setZoomSrc(e.currentTarget.src)} />
          <div className="cursive cap">Happy Birthday! 💖</div>
        </div>
        <p className="wish">Wishing you the sweetest day! 🍓✨</p>
      </div>
      {zoomSrc && (
        <div className="zoom" onClick={() => setZoomSrc(null)}>
          <img src={zoomSrc} alt="Full size" />
        </div>
      )}
    </>
  );
}
