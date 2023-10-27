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

export type IOptionRender =
  | string
  | (({ active, focused }: { active: boolean; focused: boolean }) => ReactNode);
export type IOptionItem = {
  active?: boolean;
  focused?: boolean;
  label: string;
  value: string;
  render: IOptionRender;
  forwardedRef: any;
  innerProps?: {
    group?: string | null;
    onClick: () => void;
    onMouseMove: () => void;
    onFocus: (e: FocusEvent) => void;
  };
};
interface IOptionRenderer {
  render: IOptionRender;
  onClick: () => void;
  onFocus: (e: FocusEvent) => void;
  active: boolean;
  hoveredElement?: Element;
  enterPressed: boolean;
  onFocusChanges: () => void;
  group?: string | null;
  label: string;
  value: string;
  groupMode: boolean;
  itemRender?: ({
    active,
    focused,
    innerProps,
    forwardedRef,
  }: IOptionItem) => ReactNode;
}

const OptionRenderer = forwardRef(
  (
    {
      label,
      value,
      render,
      active,
      onClick,
      onFocus,
      hoveredElement,
      enterPressed,
      onFocusChanges,
      group,
      groupMode,
      itemRender: ItemRender,
    }: IOptionRenderer,
    ref: any
  ) => {
    // const wrapperRef = ref;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      const siblings = wrapperRef.current?.parentNode?.querySelectorAll(
        '.option-item-container'
      );

      if (typeof render !== 'string') {
        siblings?.forEach((sibling) => {
          sibling.removeAttribute('focused');
        });
      } else {
        siblings?.forEach((sibling) => {
          sibling.removeAttribute('focused');
          sibling
            ?.querySelector('.option-item')
            ?.classList.remove('byte-bg-gray-400/10');
        });
        wrapperRef.current
          ?.querySelector('.option-item')
          ?.classList.add('byte-bg-gray-400/10');
      }

      wrapperRef.current?.setAttribute('focused', 'true');
      onFocusChanges();
    };

    useEffect(() => {
      setIsFocused(!!wrapperRef.current?.hasAttribute('focused'));

      if (typeof render === 'string') {
        if (wrapperRef.current?.hasAttribute('focused')) {
          wrapperRef.current
            ?.querySelector('.option-item')
            ?.classList.add('byte-bg-gray-400/10');
        } else {
          wrapperRef.current
            ?.querySelector('.option-item')
            ?.classList.remove('byte-bg-gray-400/10');
        }
      }
    }, [hoveredElement]);

    useEffect(() => {
      if (isFocused) {
        onClick();
      }
    }, [enterPressed]);

    return (
      <div className="option-item-container" ref={wrapperRef}>
        {group && (
          <div className="byte-text-xs byte-text-black/50 byte-py-2 byte-px-2">
            {group}
          </div>
        )}
        {!ItemRender && (
          <div
            tabIndex={-1}
            ref={ref}
            className={cn(
              'option-item',
              typeof render === 'string'
                ? {
                    'byte-flex byte-flex-row byte-items-center byte-select-option byte-cursor-pointer byte-py-2 byte-rounded-lg byte-border-t byte-border-y-white':
                      true,
                    'byte-bg-sky-100 byte-font-bold': active,
                    'byte-outline-none': !active,
                    'byte-pr-2 byte-pl-5': groupMode,
                    'byte-px-2': !groupMode,
                  }
                : ''
            )}
            onClick={onClick}
            onFocus={onFocus}
            onMouseMove={handleFocus}
          >
            {typeof render === 'string'
              ? render
              : render?.({ active, focused: isFocused })}
          </div>
        )}
        {ItemRender && (
          <ItemRender
            {...{
              forwardedRef: ref,
              render,
              active,
              label,
              value,
              focused: isFocused,
              innerProps: {
                onClick,
                onMouseMove: handleFocus,
                group,
                onFocus,
              },
            }}
          />
        )}
      </div>
    );
  }
);

export default OptionRenderer;
