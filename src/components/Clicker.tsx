'use client';

import { useState, useEffect } from 'react';

interface ClickerProps {
  onClick: () => void;
  disabled: boolean;
}

export function Clicker({ onClick, disabled }: ClickerProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side after hydration
    const popSound = new Audio('/pop.mp3');
    popSound.volume = 0.3;
    setAudio(popSound);
  }, []);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
    audio?.play().catch(() => {});
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-transform duration-100 select-none ${isPressed ? 'scale-95' : 'scale-100'} ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer active:scale-95'}`}
      role="button"
      aria-label="Click to earn"
      aria-disabled={disabled}
    >
      <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute inset-2 bg-primary/30 rounded-full animate-pulse delay-100 opacity-50"></div>
      
      {/* Removed Sketchfab embed and added a simple div for animation */}
      <div className={`w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold ${isPressed ? 'scale-95' : 'scale-100'} transition-transform duration-100`}>
        CLICK ME
      </div>

      {disabled && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
            <p className="text-white font-bold">Connect Wallet to Play</p>
        </div>
      )}
    </div>
  );
}
