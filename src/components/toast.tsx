'use client';

import React from 'react';

interface ToastProps {
  message: string | null;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible || !message) return null;

  return (
    <div className={`toast ${isVisible ? 'show' : ''}`} id="toast">
      {message}
    </div>
  );
};