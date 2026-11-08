import { useState } from 'react';

export default function SpotifyPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [embedSrc, setEmbedSrc] = useState<string | null>(
    // default lovely playlist / lofi playlist or template
    'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0'
  );

  const handleConnect = () => {
    const raw = urlInput.trim();
    if (!raw) return;

    let src = '';
    if (raw.includes('open.spotify.com/playlist/')) {
      const id = raw.split('playlist/')[1].split('?')[0].split('/')[0];
      src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
    } else if (raw.includes('open.spotify.com/album/')) {
      const id = raw.split('album/')[1].split('?')[0].split('/')[0];
      src = `https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`;
    } else if (raw.includes('open.spotify.com/track/')) {
      const id = raw.split('track/')[1].split('?')[0].split('/')[0];
      src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
    } else if (raw.startsWith('https://open.spotify.com/embed/')) {
      src = raw;
    } else {
      alert('Please enter a valid Spotify track, album, or playlist URL');
      return;
    }
    setEmbedSrc(src);
  };

  return (
    <>
      {/* Side button */}
      <button
        className="spotify-side-tab"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Spotify music player"
        title="Open Music Player"
      >
        <svg viewBox="0 0 24 24" className="spotify-icon" aria-hidden="true">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <span>Music</span>
      </button>

      {/* Flyout panel */}
      <div className={`spotify-flyout ${isOpen ? 'open' : ''}`}>
        <button
          className="spotify-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close music panel"
        >
          ×
        </button>

        <h3 className="cursive spotify-title">🎵 Our Playlist</h3>
        <p className="spotify-hint">Connect your favorite Spotify playlist or song:</p>

        <div className="spotify-input-row">
          <input
            type="text"
            className="spotify-input"
            placeholder="Paste Spotify link..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
          />
          <button className="spotify-connect-btn" onClick={handleConnect}>
            Connect
          </button>
        </div>

        <div className="spotify-embed-wrapper">
          {embedSrc ? (
            <iframe
              src={embedSrc}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
            />
          ) : (
            <div className="spotify-placeholder">
              Paste a Spotify link above and click Connect 🎶
            </div>
          )}
        </div>
      </div>
    </>
  );
}
