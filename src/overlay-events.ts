import { OverlayEventListener, RenderFunction } from './types';
import { createUniqueId } from './utils/createRandomId';

export let eventListener: OverlayEventListener | null = null;

export const enrollEventListener = (listener: OverlayEventListener) => {
  eventListener = listener;
};

export const overlay = {
  open: (render: RenderFunction) => {
    const id = createUniqueId();
    eventListener?.open({ id, render });
    return id;
  },

  close: (id: string) => {
    eventListener?.close(id);
  },

  closeAll: () => {
    eventListener?.closeAll();
  },
};
