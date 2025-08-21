import { createContext } from 'react';
import { OverlayContextValue } from './types';

const OverlayContext = createContext<OverlayContextValue | null>(null);

export default OverlayContext;
