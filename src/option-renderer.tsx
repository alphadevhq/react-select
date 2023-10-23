/* eslint-disable no-nested-ternary */
import {
  FocusEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from './utils';

interface IOptionRenderer {
  children?: ReactNode;
  onClick: () => void;
  onFocus: (e: FocusEvent) => void;
  active: boolean;
  className?:
    | string
    | (({
        isActive,
        isFocused,
      }: {
        isActive?: boolean;
        isFocused?: boolean;
      }) => { active?: string; focus?: string; default?: string });
  hoveredElement?: Element;
}

const OptionRenderer = forwardRef(
  (
    {
      children,
      active,
      onClick,
      onFocus,
      className,
      hoveredElement,
    }: IOptionRenderer,
    ref: any
  ) => {
    // const wrapperRef = ref;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      if (
        typeof className !== 'string' &&
        className?.({ isActive: active, isFocused })?.focus !== undefined
      ) {
        const focusClass =
          className?.({ isActive: active, isFocused })?.focus?.split(' ') || '';
        console.log(focusClass);

        const siblings =
          wrapperRef.current?.parentNode?.querySelectorAll('.option-item');
        siblings?.forEach((sibling) => {
          sibling.removeAttribute('focused');
          sibling.classList.remove(...focusClass);
        });
        wrapperRef.current?.classList.add(...focusClass);
      }

      wrapperRef.current?.setAttribute('focused', 'true');
    };

    useEffect(() => {
      setIsFocused(!!wrapperRef.current?.hasAttribute('focused'));

      if (
        typeof className !== 'string' &&
        className?.({ isActive: active, isFocused })?.focus !== undefined
      ) {
        const focusClass =
          className?.({ isActive: active, isFocused })?.focus?.split(' ') || '';
        if (wrapperRef.current?.hasAttribute('focused')) {
          wrapperRef.current?.classList.add(...focusClass);
        } else {
          wrapperRef.current?.classList.remove(...focusClass);
        }
      }

      // handleFocus();
    }, [hoveredElement]);

    return (
      <div
        tabIndex={-1}
        ref={(r) => {
          ref(r);
          wrapperRef.current = r;
        }}
        className={cn(
          'option-item',
          className !== undefined || className !== null
            ? typeof className === 'string'
              ? className
              : `${className?.({ isActive: active, isFocused }).default} ${
                  active && className?.({ isActive: active, isFocused }).active
                }`
            : {
                'byte-flex byte-flex-row byte-items-center byte-select-option byte-cursor-pointer byte-py-2 byte-rounded-lg byte-px-2 byte-border-t byte-border-y-white':
                  true,
                'byte-bg-sky-100': active,
                'byte-outline-none': !active,
                'byte-bg-gray-400/10': isFocused && !active,
              }
        )}
        onClick={onClick}
        onFocus={onFocus}
        onMouseMove={handleFocus}
      >
        {children}
      </div>
    );
  }
);

export default OptionRenderer;
