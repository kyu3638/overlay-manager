import { PropsWithChildren, useState, useEffect } from 'react';
import { enrollEventListener, overlay } from './overlay-events';
import { OverlayContext } from './OverlayContext';
import OverlayRenderer from './OverlayRenderer';
import { OverlayState, RenderFunction } from './types';

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlayState, setOverlayState] = useState<OverlayState>({
    overlays: {},
    stack: [],
  });

  const handleOpen = ({ id, render }: { id: string; render: RenderFunction }) => {
    setOverlayState((prev) => {
      const newOverlays = { ...prev.overlays, [id]: { id, render } };
      const newStack = [...prev.stack, id];

      return {
        ...prev,
        overlays: newOverlays,
        stack: newStack,
      };
    });
  };

  const handleClose = (id: string) => {
    setOverlayState((prev) => {
      const { [id]: _, ...rest } = prev.overlays;

      return {
        ...prev,
        overlays: rest,
        stack: prev.stack.filter((overlayId) => overlayId !== id),
      };
    });
  };

  const handleCloseAll = () => {
    setOverlayState({
      overlays: {},
      stack: [],
    });
  };

  enrollEventListener({ open: handleOpen, close: handleClose, closeAll: handleCloseAll });

  useEffect(() => {
    return () => handleCloseAll();
  }, []);

  return (
    <OverlayContext.Provider value={null}>
      {children}
      {overlayState.stack.map((id) => {
        const overlayItem = overlayState.overlays[id];
        if (!overlayItem) return null;

        const isOpen = overlayState.stack.includes(id);

        return <OverlayRenderer key={id} overlay={overlayItem} isOpen={isOpen} onClose={() => overlay.close(id)} />;
      })}
    </OverlayContext.Provider>
  );
};
