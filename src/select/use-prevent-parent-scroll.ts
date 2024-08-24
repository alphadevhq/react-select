import { useEffect } from 'react';

const usePreventParentScroll = (ref: any) => {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const handleTouchStart = (event: any) => {
      const startY = event.touches[0].clientY;
      const startScrollTop = element.scrollTop;

      const handleTouchMove = (event: any) => {
        const currentY = event.touches[0].clientY;
        const scrollDirection = currentY - startY;

        if (
          (scrollDirection > 0 && startScrollTop === 0) || // Scrolling up at the top
          (scrollDirection < 0 &&
            element.scrollHeight - startScrollTop === element.clientHeight) // Scrolling down at the bottom
        ) {
          event.preventDefault();
        }
      };

      element.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });

      return () => {
        element.removeEventListener('touchmove', handleTouchMove);
      };
    };

    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref]);
};

export default usePreventParentScroll;
