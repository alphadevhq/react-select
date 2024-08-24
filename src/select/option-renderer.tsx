/* eslint-disable no-nested-ternary */
import { FocusEvent, ReactNode, forwardRef } from 'react';
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
  disabled?: boolean;
  index: number;
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
      group,
      groupMode,
      itemRender: ItemRender,
      groupRender,
      disabled,
      index,
    }: IOptionRenderer,
    ref: any,
  ) => {
    const { activeIndex, setActiveIndex } = useActiveIndex();
    const focused = activeIndex === index;

    const onHover = () => {
      setActiveIndex(index);
    };

    return (
      <div
        tabIndex={-1}
        data-value={value}
        data-active={active}
        data-disabled={disabled}
        data-type={typeof value}
      >
        {(group && groupRender?.({ label: group || '' })) ||
          (group && (
            <div className="zener-text-xs zener-text-black/50 zener-py-2 zener-px-2">
              {group}
            </div>
          ))}
        {!ItemRender && (
          <div
            tabIndex={-1}
            className={cn(
              'zener-select zener-select-option zener-outline-none zener-cursor-pointer zener-py-2 zener-rounded-md zener-border-t zener-border-t-white zener-truncate',
              {
                'zener-text-black zener-bg-[#E3E3E3] zener-font-bold': active,
                'zener-mx-[5px] zener-my-[1px]': true,
                'zener-text-gray-400': !!disabled,
                'zener-pr-2 zener-pl-5': groupMode,
                'zener-px-2': !groupMode,
                'zener-bg-gray-400/10': focused && !active,
              },
            )}
            onClick={() => {
              if (!disabled) {
                onClick?.();
              }
            }}
            onFocus={onFocus}
            onMouseMove={onHover}
            onMouseEnter={onHover}
          >
            {render?.({ active, focused, disabled, groupMode })}
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
              disabled,
              groupMode,
              innerProps: {
                onClick: () => {
                  if (!disabled) {
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
