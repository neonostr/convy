import React, { useRef, useState } from 'react';

declare const __BUILD_ID__: string;
const BUILD_ID: string = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev';

const SLOGAN = 'Built for people who price the world in sats.';
const TAPS_TO_REVEAL = 5;
const TAP_WINDOW_MS = 1500;

/** Build IDs are UTC timestamps like 20261119T094800Z; show them readably. */
function formatBuildId(id: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}Z$/.exec(id);
  if (!m) return id;
  const [, y, mo, d, h, mi] = m;
  return `${y}-${mo}-${d} ${h}:${mi} UTC`;
}

/** Settings footer: slogan; 5 quick taps reveal the build time, one tap hides it. */
const AppVersion = () => {
  const [showVersion, setShowVersion] = useState(false);
  const taps = useRef(0);
  const lastTap = useRef(0);

  const onTap = () => {
    if (showVersion) {
      setShowVersion(false);
      taps.current = 0;
      return;
    }
    const now = Date.now();
    taps.current = now - lastTap.current <= TAP_WINDOW_MS ? taps.current + 1 : 1;
    lastTap.current = now;
    if (taps.current >= TAPS_TO_REVEAL) {
      taps.current = 0;
      setShowVersion(true);
    }
  };

  return (
    <div className="pt-4 border-t text-center">
      <button
        type="button"
        onClick={onTap}
        aria-label={SLOGAN}
        className="mx-auto block select-none text-xs leading-relaxed text-muted-foreground"
      >
        {showVersion ? `Version ${formatBuildId(BUILD_ID)}` : SLOGAN}
      </button>
    </div>
  );
};

export default AppVersion;
