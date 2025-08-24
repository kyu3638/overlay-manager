import { OverlayItem } from './types';

type OverlayRendererProps = {
  overlay: OverlayItem;
  isOpen: boolean;
  onClose: () => void;
};

const OverlayRenderer = ({ overlay, isOpen, onClose }: OverlayRendererProps) => {
  return overlay.render({ isOpen, close: onClose });
};

export default OverlayRenderer;
