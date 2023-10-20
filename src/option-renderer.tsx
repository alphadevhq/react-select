import { FocusEvent, ReactNode, forwardRef, useEffect, useRef } from 'react';
import { cn } from './utils';

interface IOptionRenderer {
  children?: ReactNode;
  onClick: () => void;
  onFocus: (e: FocusEvent) => void;
  active: boolean;
  className?: string;
}

const OptionRenderer = forwardRef(
  (
    { children, active, onClick, onFocus, className }: IOptionRenderer,
    ref: any
  ) => {
    const context = useRef(ref);

    useEffect(() => {
      console.log(context.current);
    }, [context.current]);
    return (
      <div
        tabIndex={-1}
        ref={context}
        className={cn(
          'option-item',
          className !== undefined || className !== null
            ? className
            : {
                'byte-flex byte-flex-row byte-items-center byte-select-option byte-cursor-pointer byte-py-2 byte-rounded-lg byte-px-2 byte-border-t byte-border-y-white':
                  true,
                'byte-bg-sky-100': active,
                'byte-outline-none hover:byte-bg-gray-400/10': !active,
              }
        )}
        onClick={onClick}
        onFocus={onFocus}
      >
        {children}
      </div>
    );
  }
);

export default OptionRenderer;
