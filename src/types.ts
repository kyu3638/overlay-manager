import { ReactNode } from 'react';

export type OverlayItem = {
  id: string;
  render: RenderFunction;
};

export type OverlayState = {
  overlays: Record<string, OverlayItem>;
  stack: string[];
};

export type RenderFunction = (props: { isOpen: boolean; close: () => void }) => ReactNode;

export type OverlayEventListener = {
  open: (overlay: { id: string; render: RenderFunction }) => void;
  close: (id: string) => void;
  closeAll: () => void;
};
