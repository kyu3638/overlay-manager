import { ReactNode } from 'react';

export type OverlayItem = {
  id: string;
  component: ReactNode;
};

export type OverlayContextValue = {
  overlayList: OverlayItem[];
  open: (component: ReactNode) => void;
  close: (id?: string) => void;
  closeAll: () => void;
};
