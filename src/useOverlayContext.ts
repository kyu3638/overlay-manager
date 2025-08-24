import { useContext } from 'react';
import { OverlayContext } from './OverlayContext';

export const useOverlayContext = () => {
  const context = useContext(OverlayContext);

  if (context === null) {
    throw new Error('useOverlayContext must be used within an OverlayProvider');
  }

  return context;
};
