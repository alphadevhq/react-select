/* eslint-disable no-nested-ternary */
import {
  FocusEvent,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { cn } from './utils';
import useActiveIndex from './use-active-index';

export type IOptionRender = ({
  active,
  focused,
  disabled,
  groupMode,
}: {
  active: boolean;
  focused: boolean;
  disabled?: boolean;
  groupMode?: boolean;
}) => ReactNode;

export type IOptionItem = {
  active?: boolean;
  focused?: boolean;
  label: string;
  value: string;
  render: IOptionRender;
  disabled?: boolean;
  groupMode?: boolean;
  innerProps?: {
    group?: string | null;
    onClick: () => void;
    onMouseMove: () => void;
    onMouseEnter: () => void;
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
  group?: string | null;
  label: string;
  value: string;
  groupMode: boolean;
  itemRender?: ({
    active,
    focused,
    disabled,
    innerProps,
    groupMode,
  }: IOptionItem) => ReactNode;
  groupRender?: ({ label }: { label: string }) => ReactNode;
  disabled?: () => boolean | boolean;
  index: number;
  isScrolling: boolean;
  dialogRef: RefObject<HTMLDivElement>;
}

const cDisabled = (disabled: (() => boolean) | boolean | undefined) =>
  typeof disabled === 'function' ? !!disabled?.() : !!disabled;

const OptionRenderer = forwardRef(
  (
    {
      label,
      value,
      render,
      active,
      onClick,
      onFocus,
      group,
      groupMode,
      itemRender: ItemRender,
      groupRender,
      disabled,
      index,
      isScrolling,
      dialogRef,
    }: IOptionRenderer,
    ref: any,
  ) => {
    const { activeIndex, setActiveIndex } = useActiveIndex();
    const focused = activeIndex === index;
    const containerRef = useRef<HTMLDivElement>(null);

    const onHover = () => {
      if (isScrolling || cDisabled(disabled)) {
        return;
      }
      setActiveIndex(index);
    };

    useEffect(() => {
      // after stop scrolling item which has mouseover should be focused
      if (!isScrolling && dialogRef.current) {
        const currentHoverItem = Array.from(
          dialogRef.current.querySelectorAll(':hover'),
        ).find((e) => e.classList.contains('zener-select-option-container'));
        if (
          currentHoverItem &&
          currentHoverItem.contains(containerRef.current)
        ) {
          onHover();
        }
      }
    }, [isScrolling, containerRef.current, dialogRef.current]);

    return (
      <div
        ref={containerRef}
        tabIndex={-1}
        data-value={value}
        data-active={active}
        data-disabled={cDisabled(disabled)}
        data-type={typeof value}
      >
        {(group && groupRender?.({ label: group || '' })) ||
          (group && (
            <div className="zener-text-xs zener-text-black/50 zener-py-2 zener-px-2 zener-select-none zener-cursor-default">
              {group}
            </div>
          ))}
        {!ItemRender && (
          <div
            ref={ref}
            tabIndex={-1}
            className={cn(
              'zener-cursor-default zener-select zener-select-option zener-outline-none zener-select-none zener-py-2 zener-rounded-md zener-border-solid zener-border-0 zener-border-y zener-border-y-white zener-truncate',
              {
                'zener-text-black zener-bg-[#E3E3E3] zener-font-bold': active,
                'zener-mx-[5px]': true,
                'zener-text-gray-400': !!cDisabled(disabled),
                'zener-pr-2 zener-pl-5': groupMode,
                'zener-px-2': !groupMode,
                'zener-bg-gray-400/10':
                  focused && !active && !cDisabled(disabled),
              },
            )}
            onClick={() => {
              if (!cDisabled(disabled)) {
                onClick?.();
              }
            }}
            onFocus={onFocus}
            onMouseMove={onHover}
            onMouseEnter={onHover}
          >
            {render?.({
              active,
              focused,
              disabled: cDisabled(disabled),
              groupMode,
            })}
          </div>
        )}
        {ItemRender && (
          <ItemRender
            {...{
              render,
              active,
              label,
              value,
              focused,
              disabled: !!cDisabled(disabled),
              groupMode,
              innerProps: {
                onClick: () => {
                  if (!cDisabled(disabled)) {
                    onClick?.();
                  }
                },
                onMouseMove: onHover,
                onMouseEnter: onHover,
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
  },
);

export default OptionRenderer;
