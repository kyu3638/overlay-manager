import { useMemo } from 'react';

const useCreateRoot = (id: string) => {
  return useMemo(() => {
    const root = document.getElementById(id);

    if (!root) {
      const newRoot = document.createElement('div');
      newRoot.id = id;
      document.body.appendChild(newRoot);
      return newRoot;
    }

    return root;
  }, [id]);
};

export default useCreateRoot;
