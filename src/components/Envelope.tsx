import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  seal?: string;
  onClick?: () => void;
  children?: ReactNode;
}

/** Layers (back → front): back, paper, front pocket, flap, seal. */
export default function Envelope({ open, seal = '🍓', onClick, children }: Props) {
  return (
    <div
      className={`env ${open ? 'open' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? 'Envelope' : undefined}
    >
      <div className="env-back" />
      <div className="paper">{children}</div>
      <div className="env-front" />
      <div className="flap" />
      <span className="seal">{seal}</span>
    </div>
  );
}
