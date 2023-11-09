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
  innerProps?: {
    group?: string | null;
    onClick: () => void;
    onMouseMove: () => void;
    onFocus: (e: FocusEvent) => void;
    ref: any;
    tabIndex: number | undefined;
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
  itemRender?: ({ active, focused, innerProps }: IOptionItem) => ReactNode;
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
        if (!(wrapperRef.current?.getAttribute('data-active') === 'true')) {
          wrapperRef.current
            ?.querySelector('.option-item')
            ?.classList.add('byte-bg-gray-400/10');
        }
      }

      wrapperRef.current?.setAttribute('focused', 'true');
      onFocusChanges();
    };

    useEffect(() => {
      setIsFocused(!!wrapperRef.current?.hasAttribute('focused'));

      if (typeof render === 'string') {
        if (wrapperRef.current?.hasAttribute('focused')) {
          if (!(wrapperRef.current?.getAttribute('data-active') === 'true')) {
            wrapperRef.current
              ?.querySelector('.option-item')
              ?.classList.add('byte-bg-gray-400/10');
          }
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
      <div
        className="option-item-container"
        ref={wrapperRef}
        data-value={value}
        data-active={active}
      >
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
                    'byte-select byte-select-option byte-outline-none byte-cursor-pointer byte-py-2 byte-rounded-lg byte-border-t byte-border-t-white byte-truncate ':
                      true,
                    'byte-text-black byte-bg-[#E3E3E3] byte-font-bold': active,
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
                tabIndex: -1,
                ref,
              },
            }}
          />
        )}
      </div>
    );
  }
);

export default OptionRenderer;
