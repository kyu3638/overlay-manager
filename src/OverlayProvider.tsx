import { Fragment, ReactNode, useState } from 'react';
import OverlayContext from './OverlayContext';
import { OverlayContextValue, OverlayItem } from './types';
import { createRandomId } from './lib/utils/createRandomId';
import { createPortal } from 'react-dom';
import useCreateRoot from './lib/hooks/useCreateRoot';

type OverlayProviderProps = {
  children: ReactNode;
};

const OverlayProvider = ({ children }: OverlayProviderProps) => {
  const [overlayList, setOverlayList] = useState<OverlayItem[]>([]);

  const open: OverlayContextValue['open'] = (component) => {
    const id = createRandomId();
    const newOverlay: OverlayItem = { id, component };
    setOverlayList((prev) => [...prev, newOverlay]);
  };

  const close: OverlayContextValue['close'] = (id) => {
    if (!id) {
      setOverlayList((prev) => [...prev].slice(0, -1));
    } else {
      setOverlayList((prev) => [...prev].filter((overlay) => overlay.id !== id));
    }
  };

  const closeAll: OverlayContextValue['closeAll'] = () => {
    setOverlayList([]);
  };

  const root = useCreateRoot('overlay-root');

  return (
    <OverlayContext.Provider value={{ overlayList, open, close, closeAll }}>
      {children}
      {createPortal(
        overlayList.map((overlay) => {
          return <Fragment key={overlay.id}>{overlay.component}</Fragment>;
        }),
        root
      )}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;
