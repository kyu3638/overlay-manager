import { useContext } from 'react';
import OverlayContext from './OverlayContext';

const useOverlayContext = () => {
  const context = useContext(OverlayContext);

  if (!context) {
    throw new Error('useOverlayContext must be used whitin a OverlayProvider');
  }

  return context;
};

export default useOverlayContext;
