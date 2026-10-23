import { useState } from 'react';
import DefenseLetter from './components/DefenseLetter';
import Cabinet from './components/Cabinet';
import { LETTERS } from './data/letters';

export default function App() {
  const [showCabinet, setShowCabinet] = useState(false);

  if (showCabinet) return <Cabinet letters={LETTERS} />;

  return (
    <section className="stage">
      <DefenseLetter finishLabel="Open the letter cabinet 🗄️" onFinish={() => setShowCabinet(true)} />
    </section>
  );
}
