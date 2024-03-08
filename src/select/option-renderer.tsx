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
  groupRender?: ({ label }: { label: string }) => ReactNode;
  disabled?: boolean;
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
      groupRender,
      disabled,
    }: IOptionRenderer,
    ref: any
  ) => {
    // const wrapperRef = ref;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      if (disabled) {
        return;
      }

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
            ?.classList.remove('zener-bg-gray-400/10');
        });
        if (!(wrapperRef.current?.getAttribute('data-active') === 'true')) {
          wrapperRef.current
            ?.querySelector('.option-item')
            ?.classList.add('zener-bg-gray-400/10');
        }
      }

      wrapperRef.current?.setAttribute('focused', 'true');
      onFocusChanges();
    };

    useEffect(() => {
      setIsFocused(!!wrapperRef.current?.hasAttribute('focused'));

      if (wrapperRef.current?.hasAttribute('focused')) {
        if (!(wrapperRef.current?.getAttribute('data-active') === 'true')) {
          wrapperRef.current
            ?.querySelector('.option-item')
            ?.classList.add('zener-bg-gray-400/10');
        }
      } else {
        wrapperRef.current
          ?.querySelector('.option-item')
          ?.classList.remove('zener-bg-gray-400/10');
      }
    }, [hoveredElement]);

    useEffect(() => {
      if (isFocused && !disabled) {
        onClick();
      }
    }, [enterPressed]);

    return (
      <div
        className="option-item-container"
        ref={wrapperRef}
        data-value={value}
        data-active={active}
        data-disabled={disabled}
        data-type={typeof value}
      >
        <div ref={ref} tabIndex={-1}>
          {(group && groupRender?.({ label: group || '' })) ||
            (group && (
              <div className="zener-text-xs zener-text-black/50 zener-py-2 zener-px-2">
                {group}
              </div>
            ))}
          {!ItemRender && (
            <div
              tabIndex={-1}
              className={cn('option-item', {
                'zener-select zener-select-option zener-outline-none zener-cursor-pointer zener-py-2 zener-rounded-lg zener-border-t zener-border-t-white zener-truncate ':
                  true,
                'zener-text-black zener-bg-[#E3E3E3] zener-font-bold': active,
                'zener-text-gray-400': !!disabled,
                'zener-pr-2 zener-pl-5': groupMode,
                'zener-px-2': !groupMode,
              })}
              onClick={() => {
                if (!disabled) {
                  onClick?.();
                }
              }}
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
      </div>
    );
  }
);

export default OptionRenderer;
