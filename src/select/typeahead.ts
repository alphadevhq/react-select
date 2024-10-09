import { useEffect, useState } from 'react';

const useTypehead = ({
  items,
  element,
  enabled,
}: {
  items: { label: string; value: string }[];
  element: HTMLDivElement | null;
  enabled?: boolean;
}) => {
  const [typedString, setTypedString] = useState('');
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchTimeout = 500; // time in ms to reset typedString

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (typedString !== '') {
      // Find item that starts with typedString
      const index = items.findIndex((item) =>
        item.label.toLowerCase().startsWith(typedString.toLowerCase()),
      );

      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [typedString, items, enabled]);

  const handleKeyPress = (event: KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!enabled) {
      return;
    }
    const currentTime = new Date().getTime();
    const char = event.key.toLowerCase();

    if (currentTime - lastKeyPressTime <= searchTimeout) {
      // Concatenate to typedString
      setTypedString((prev) => prev + char);
    } else {
      // Reset typedString to current key
      setTypedString(char);
    }

    setLastKeyPressTime(currentTime);
  };

  useEffect(() => {
    if (enabled && element) {
      // Add keypress listener
      element.addEventListener('keypress', handleKeyPress);

      return () => {
        // Cleanup listener on component unmount
        element.removeEventListener('keypress', handleKeyPress);
      };
    }
    return () => {};
  }, [lastKeyPressTime, typedString, enabled, element]);

  return { selectedIndex };
};

export default useTypehead;
