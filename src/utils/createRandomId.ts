export const createUniqueId = () => {
  return `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};
