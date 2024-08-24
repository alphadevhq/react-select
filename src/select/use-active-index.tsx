import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

const ActiveIndexContext = createContext<{
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}>({ activeIndex: 0, setActiveIndex() {} });

export const ActiveIndexProvider = ({ children }: { children?: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <ActiveIndexContext.Provider
      value={useMemo(
        () => ({ activeIndex, setActiveIndex }),
        [activeIndex, setActiveIndex],
      )}
    >
      {children}
    </ActiveIndexContext.Provider>
  );
};

const useActiveIndex = () => {
  return useContext(ActiveIndexContext);
};

export default useActiveIndex;
