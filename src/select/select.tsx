/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { AnimationProps } from 'framer-motion';
import {
  Key,
  KeyboardEvent,
  ReactNode,
  TouchEventHandler,
  UIEventHandler,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { VirtualizerHandle } from 'virtua';
import CloseIcon from './close-icon';
import DropdownIcon from './dropdown-icon';
import type { IGroupOption, IOption } from './option';
import { IOptionItem } from './option-renderer';
import Tag from './tag';
import { cn } from './utils';
import Loading from './loading';
import useTypehead from './typeahead';
import useActiveIndex, { ActiveIndexProvider } from './use-active-index';
import VirtualList from './virtual-list';
import useBounds from './use-bounds';

const creatableSignatureLabel = '47ea1738-6a8e-4d87-88c1-f19e291d604e';
const creatableSignatureValue = '92a73c38-81c0-42e0-8182-8f9b006d7dc6';

export type ISelectedOption<T extends Record<string, any>> =
  | {
      label: string;
      value: string;
    }
  | T;

type ExtractOptionType<T, U> = T extends IGroupOption<IOption[] | T[]>[]
  ? U extends true
    ? T[number]['options']
    : T[number]['options'][number]
  : U extends true
    ? IOption[] & T
    : ExtractArrayType<IOption & T>;

type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

export type ITagRender = {
  remove: (value: string) => void;
  value: string;
  label: string;
  key?: Key;
};

export type ISuffixRender = {
  showclear?: boolean;
  clear?: () => void;
  isOpen?: boolean;
  loading?: boolean;
};

export type IGroupRender = { label: string };

export type IMenuItemRender = IOptionItem;

export interface ISelect<T, U> {
  options: () => Promise<T & (IOption[] | IGroupOption<IOption[] | T>[])>;
  noOptionMessage?: ReactNode;
  disableWhileLoading?: boolean;
  placeholder?: ReactNode;
  multiple?: U;
  open?: boolean | undefined;
  disabled?: boolean;
  onSearch?: (text: string) => void | boolean;
  searchable?: boolean;
  creatable?: boolean;
  showclear?: boolean;
  suffixRender?: (value: ISuffixRender) => ReactNode;
  groupRender?: (value: IGroupRender) => ReactNode;
  tagRender?: (value: ITagRender) => ReactNode;
  menuItemRender?: (value: IMenuItemRender) => ReactNode;
  valueRender?: (value: ExtractOptionType<T, U>) => ReactNode;
  className?:
    | string
    | (() => { focus?: string; disabled?: string; default?: string });
  portalClass?: string;
  menuClass?: string;
  animation?: null | AnimationProps;
  onChange?: (
    value: ExtractOptionType<T, U>,
    valueAsString: U extends true ? string[] : string,
  ) => void;
  value: (U extends true ? string[] : string) | undefined;
  onOpenChange?: (open: boolean) => void;
  createLabel?: string;
  tabIndex?: number;
  noMenu?: boolean;
  onWheel?: WheelEventHandler<HTMLDivElement>;
  onTouchMove?: TouchEventHandler<HTMLDivElement>;
  onScroll?: UIEventHandler<HTMLDivElement>;
  maxMenuHeight?: number;
}

const SelectComponent = <T, U extends boolean | undefined = undefined>({
  options,
  multiple = false,
  disabled = false,
  open = undefined,
  disableWhileLoading,
  creatable = false,
  suffixRender,
  showclear = false,
  portalClass,
  menuClass,
  tagRender,
  onChange,
  value,
  menuItemRender,
  placeholder,
  className,
  valueRender,
  onOpenChange,
  onSearch,
  searchable = true,
  tabIndex,
  noMenu,
  createLabel,
  animation,
  noOptionMessage,
  groupRender,
  onScroll,
  onWheel,
  onTouchMove,
  maxMenuHeight,
}: ISelect<T, U>) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VirtualizerHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const [filteredOptions, setFilteredOptions] = useState<
    (IOption & { group?: string | null; groupMode?: boolean })[]
  >([]);

  const [flatOptions, setFlatOptions] = useState<typeof filteredOptions>([]);

  const [selectedOption, setSelectedOption] = useState<
    ISelectedOption<IOption>[]
  >([]);

  const [inputText, setInputText] = useState('');

  const [filterable, setFilterable] = useState(searchable);

  const hiddenTextRef = useRef<HTMLDivElement>(null);

  const { activeIndex, setActiveIndex } = useActiveIndex();

  const [w, setW] = useState(4);

  const { bounds } = useBounds(selectContainerRef, [
    show,
    open,
    inputText,
    w,
    selectedOption,
  ]);
  // this is for setting the selected value when value is passed from props
  useEffect(() => {
    if (!value) {
      setSelectedOption([]);
      return;
    }
    if (value && flatOptions.length > 0) {
      let filteredArray = [];
      if (Array.isArray(value) && multiple) {
        if (creatable) {
          filteredArray = value.map((v) => {
            const f = flatOptions.find((fo) => fo.value === v);
            if (f) {
              return f;
            }
            return { label: v, value: v };
          }) as typeof flatOptions;
          setSelectedOption(filteredArray);
        } else {
          filteredArray = flatOptions.filter((fo) =>
            value.find((v) => v === fo.value),
          );
          setSelectedOption(filteredArray);
        }
      } else {
        const v = value;
        if (!value) {
          setSelectedOption([]);
          return;
        }
        if (Array.isArray(value)) {
          return;
        }
        // @ts-ignore
        if (creatable) {
          // @ts-ignore
          const f = flatOptions.find((fo) => fo.value === v);
          if (f) {
            filteredArray = [f];
            if (filteredArray.length > 0) {
              setSelectedOption(filteredArray);
            }
          } else {
            setSelectedOption([{ label: value, value }]);
          }
        } else {
          // @ts-ignore
          const f = flatOptions.find((fo) => fo.value === v);
          if (f) {
            filteredArray = [f];
            if (filteredArray.length > 0) {
              setSelectedOption(filteredArray);
            }
          }
        }
      }
    } else if (multiple) {
      if (Array.isArray(value))
        setSelectedOption(value?.map((v) => ({ label: v, value: v })));
    } else if (!Array.isArray(value))
      setSelectedOption([{ label: value, value }]);
  }, [flatOptions, value]);

  // when the options changes this makes sure the options are flattend if in group mode
  useEffect(() => {
    (async () => {
      setLoading(true);
      const opt = await options?.();

      if (opt && opt.length > 0) {
        if ('options' in opt[0]) {
          const filtered = (opt as IGroupOption<IOption[] | T[]>[]).flatMap(
            (opt) =>
              opt.options?.map((optt, index) => ({
                ...optt,
                group: index === 0 ? opt.label : null,
                groupMode: true,
              })),
          );

          setFlatOptions(filtered as any);
        } else {
          setFlatOptions(opt as IOption[]);
        }
      } else {
        setFlatOptions([]);
      }
      setLoading(false);
    })();
  }, [options]);

  // for filtering the options
  useEffect(() => {
    if (creatable || filterable) {
      try {
        const filtered = flatOptions.filter((fot) => {
          return fot.label?.toLowerCase().includes(inputText?.toLowerCase());
        });

        const isSearchElementPresent = flatOptions.find(
          (fot) => fot.label?.toLowerCase() === inputText?.toLowerCase(),
        );

        if (!isSearchElementPresent && creatable && inputText && !loading) {
          filtered.push({
            label: inputText,
            value: inputText,
            // @ts-ignore
            [creatableSignatureLabel]: creatableSignatureValue,
          });
        }
        setFilteredOptions(filtered);
      } catch (err) {
        console.log(err);
      }
    } else {
      setFilteredOptions(flatOptions);
    }
  }, [inputText, filterable, flatOptions, creatable]);

  // get value based on multiple or single selection
  const getVal = (data: ISelectedOption<IOption>[]) => {
    return (multiple ? data : data?.[0]) as any;
  };

  // remove tags items if multiple is enabled
  const removeTag = (tag: string) => {
    const val = getVal(selectedOption.filter((so) => so.value !== tag));
    setSelectedOption(val);
    // @ts-ignore
    onChange?.(val as any, val?.map((v) => v.value) || ([] as any));
    selectContainerRef.current?.focus();
    inputRef.current?.focus();
  };

  useEffect(() => {
    setW(Math.max(4, hiddenTextRef.current?.clientWidth || 0));
  }, [inputText]);

  // set disable state for select
  useEffect(() => {
    setIsDisabled(disabled || (disableWhileLoading && loading) || false);
    selectContainerRef.current?.setAttribute('disabled', `${disabled}`);
  }, [disabled, disableWhileLoading, loading]);

  // make sure the menu hidden if disabled while opening
  useEffect(() => {
    if (isDisabled) {
      setShow(false);
    } else {
      setShow(!!open);
    }
  }, [open, isDisabled]);

  // set focus on input container
  const setFocus = () => {
    if (isDisabled) {
      return;
    }

    if (className && typeof className === 'function' && !!className().focus) {
      selectContainerRef.current?.classList.add(
        ...(className().focus?.split(' ') || ['']),
      );
    }
  };

  // remove focus from input container
  const removeFocus = () => {
    if (className && typeof className === 'function' && !!className().focus) {
      selectContainerRef.current?.classList.remove(
        ...(className().focus?.split(' ') || ['']),
      );
      selectContainerRef.current?.classList.add(
        ...(className().default?.split(' ') || ['']),
      );
    }
  };

  // close the menu
  const closeMenu = () => {
    if (open === undefined) {
      setShow(false);
    }
  };

  // clear the selected values and close the list
  const onClear = () => {
    setSelectedOption([]);
    onChange?.([] as any, [] as any);
    inputRef.current?.focus();
    closeMenu();
    setActiveIndex(0);
  };

  // clear input text and trigger openchange
  useEffect(() => {
    if (!show) {
      setInputText('');
    }
    onOpenChange?.(show);
  }, [show]);

  // typeahead feature
  const { selectedIndex } = useTypehead({
    element: selectContainerRef.current,
    items: flatOptions,
    enabled: !creatable && !searchable && show,
  });

  // on typeahead search select the searched item.
  useEffect(() => {
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
      listRef.current?.scrollToIndex(selectedIndex, { align: 'nearest' });
    }
  }, [selectedIndex]);

  // no menu option
  const handleNoMenuMode = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && inputText && creatable && noMenu) {
      if (
        selectedOption.find(
          (s) => s.label === inputText && s.value === inputText,
        )
      ) {
        setInputText('');
        return;
      }
      const v = { label: inputText, value: inputText, disabled: false };
      let val;
      if (multiple) {
        val = [...selectedOption, v];
        setSelectedOption(val);
      } else {
        val = v;
        setSelectedOption([v]);
      }
      onChange?.(
        val as any,
        // @ts-ignore
        (multiple
          ? // @ts-ignore

            val?.map((v) => v.value)
          : // @ts-ignore
            val?.value) as any,
      );
      setInputText('');
    }
  };

  const getItem = (value: string) =>
    selectedOption.find((so) => so.value === value);

  const isActive = (value: string) =>
    multiple ? !!getItem(value) : value === selectedOption[0]?.value;

  const isMultipleItemExists = (value: string) => !!getItem(value) && multiple;

  const handleKeyboardNavigation = (e: KeyboardEvent) => {
    const { key, metaKey } = e;
    let nextIndex = activeIndex;
    if (key === 'ArrowDown') {
      nextIndex = Math.min(filteredOptions.length - 1, nextIndex + 1);
      if (metaKey) {
        nextIndex = filteredOptions.length - 1;
      }
    } else if (key === 'ArrowUp') {
      nextIndex = Math.max(0, nextIndex - 1);
      if (metaKey) {
        nextIndex = 0;
      }
    } else {
      return;
    }

    listRef.current?.scrollToIndex(nextIndex, {
      align: 'nearest',
    });

    setActiveIndex(nextIndex);
  };

  // on menu item clicked set it as selected if not already selected else deselect it.
  const onItemClicked = (data: any) => {
    const { value: dvalue } = data;
    const selectValue = { ...data };
    delete selectValue.group;
    delete selectValue.groupMode;
    delete selectValue.render;

    if (disabled) {
      return;
    }

    inputRef.current?.focus();
    // @ts-ignore
    let val;

    if (getItem(dvalue)) {
      val = selectedOption.filter((v) => v.value !== dvalue);
      if (creatable) {
        setSelectedOption(val);
      }
    } else if (!multiple) {
      val = selectValue;
      if (creatable) {
        setSelectedOption([val]);
      }

      closeMenu();
    } else {
      val = [...selectedOption, selectValue];
      if (creatable) {
        setSelectedOption(val);
      }
    }

    onChange?.(
      val as any,
      // @ts-ignore
      (multiple
        ? // @ts-ignore

          val?.map((v) => v.value)
        : // @ts-ignore
          val?.value) as any,
    );

    if (creatable && filteredOptions.length === 1 && inputText !== '') {
      closeMenu();
    }

    setInputText('');
    if (!(filterable || searchable || creatable)) {
      selectContainerRef.current?.focus();
    }
    inputRef.current?.focus();

    if (!multiple && !disabled) {
      closeMenu();
    }
  };

  return (
    <div
      tabIndex={tabIndex || (searchable || creatable ? -1 : 0)}
      ref={selectContainerRef}
      className={cn(
        'zener-select zener-relative zener-flex zener-flex-row zener-items-center pulsable',
        {
          'zener-text-black/25 zener-bg-black/5 zener-border-stone-100':
            !className && isDisabled,
        },
        className && typeof className === 'function'
          ? `${isDisabled ? className().disabled : className().default}`
          : className ||
              `${!isDisabled ? 'focus:zener-ring-1 focus:zener-ring-blue-400 focus-within:zener-ring-1 focus-within:zener-ring-blue-400' : ''} zener-font-sans zener-bg-white zener-text-sm zener-px-2 zener-py-0.5 zener-border-solid zener-border zener-border-stone-200 zener-rounded zener-min-w-[50px] zener-outline-none`,
      )}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        if (!isDisabled) {
          if (show) {
            closeMenu();
          } else {
            setShow(true);
          }
          inputRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (isDisabled) {
          return;
        }
        removeFocus();
        if (
          !portalRef?.current?.contains(e.relatedTarget) &&
          !selectContainerRef.current?.contains(e.relatedTarget) &&
          show
        ) {
          closeMenu();
        }
      }}
      onFocus={() => {
        if (isDisabled) {
          return;
        }
        setFocus();
      }}
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }
        const { code, ctrlKey } = e;

        switch (code) {
          case 'Enter':
            {
              e.preventDefault();
              const item = filteredOptions.at(activeIndex);
              if (item) {
                onItemClicked(item);
              }
            }
            break;
          case 'ArrowUp':
          case 'ArrowDown':
            e.preventDefault();
            if (!show) {
              setShow(true);
              break;
            }
            handleKeyboardNavigation(e);
            break;
          case 'Space':
            if (ctrlKey) {
              e.preventDefault();
              if (show) {
                setShow(false);
              } else {
                setShow(true);
              }
            }
            break;
          case 'Escape':
            e.preventDefault();
            closeMenu();
            break;
          default:
            break;
        }
      }}
    >
      <div
        className={cn(
          'zener-flex-1 zener-overflow-hidden zener-relative',
          'zener-flex zener-flex-row zener-items-center zener-gap-0.5 zener-mx-0.5 zener-min-h-[24px] zener-h-full',
          {
            'zener-flex-wrap': multiple,
            'zener-flex-1': !multiple,
            'zener-cursor-text': (searchable || !!creatable) && !isDisabled,
          },
          multiple && selectedOption.length > 0 ? '-zener-ml-1' : '',
        )}
      >
        {/* Tag section for multiple selection mode */}

        {multiple &&
          selectedOption.map(
            (so) =>
              (tagRender &&
                tagRender?.({
                  label: so.label,
                  value: so.value,
                  remove: removeTag,
                  key: so.value,
                })) || (
                <Tag
                  key={so.value}
                  disabled={isDisabled}
                  value={so.value}
                  onClose={(value) => {
                    removeTag(value);
                  }}
                >
                  {so.label}
                </Tag>
              ),
          )}

        {/* Single selection value */}
        {!multiple && selectedOption.length > 0 && (
          <div
            className={cn('zener-flex zener-items-center zener-min-w-0', {
              'zener-transition-all': show,
              'zener-opacity-30': show && !open && !noMenu,
              'zener-hidden': !!inputText,
              'zener-w-full': !(creatable || searchable),
            })}
          >
            <div
              className={cn({
                'zener-truncate zener-w-full': !multiple,
              })}
            >
              {valueRender
                ? valueRender?.(selectedOption[0] as any)
                : selectedOption[0].label}
            </div>
          </div>
        )}

        {/* Placeholder */}

        {selectedOption.length > 0 ? null : typeof placeholder === 'string' ? (
          <div
            className={cn(
              'zener-text-black/20 zener-select-none zener-absolute zener-left-0 zener-transition-all zener-flex zener-items-center zener-min-h-[24px]',
              placeholder && !inputText && selectedOption.length === 0
                ? 'zener-opacity-100'
                : 'zener-opacity-0',
            )}
          >
            {placeholder}
          </div>
        ) : (
          <div
            className={cn(
              'zener-absolute zener-left-0 zener-transition-all zener-flex zener-items-center zener-min-h-[24px]',
              placeholder && !inputText && selectedOption.length === 0
                ? 'zener-opacity-100'
                : 'zener-opacity-0',
            )}
          >
            {placeholder}
          </div>
        )}

        {/* Input field for filterable or creatable mode */}

        {(searchable || creatable) && (
          <div
            className={cn('zener-max-w-full', {
              'zener-absolute zener-inset-0 zener-flex-1': !multiple,
            })}
          >
            <div
              ref={hiddenTextRef}
              className="zener-invisible zener-h-0 zener-overflow-hidden zener-w-fit zener-whitespace-pre"
            >
              {inputText}
            </div>
            <div
              style={{
                width: Math.max(
                  4,
                  (hiddenTextRef.current?.clientWidth || 0) + 20,
                ),
              }}
              className={cn('zener-max-w-full zener-h-full', {
                'zener-flex zener-items-center': !multiple,
              })}
            >
              <input
                tabIndex={tabIndex}
                disabled={isDisabled}
                autoComplete="off"
                ref={inputRef}
                onPaste={() => {
                  setShow(true);
                }}
                onFocus={() => {
                  setFocus();
                }}
                onBlur={() => {
                  removeFocus();
                }}
                onKeyDown={(e: KeyboardEvent) => {
                  const { code, ctrlKey } = e;

                  if (
                    !inputText &&
                    code === 'Backspace' &&
                    multiple &&
                    (searchable || creatable)
                  ) {
                    const val = selectedOption.slice(
                      0,
                      selectedOption.length - 1,
                    );

                    setSelectedOption(val);

                    onChange?.(val as any, val.map((v) => v.value) as any);
                  }

                  if (code === 'Space' && ctrlKey) {
                    setShow(true);
                  }
                }}
                onKeyUp={(e: KeyboardEvent) => {
                  const reg = /^[0-9a-zA-Z\\@#$-/:-?{-~!"^_`\[\]]+$/;
                  if (!show && inputRef.current?.value.match(reg)) {
                    setShow(true);
                  }
                  handleNoMenuMode(e);
                }}
                className={cn(
                  'zener-outline-none min-w-[4.1px] zener-bg-transparent zener-h-full zener-border-0',
                  {
                    'zener-w-full ': multiple,
                  },
                  {
                    'zener-absolute zener-inset-0':
                      !multiple && (searchable || !!creatable),
                  },
                )}
                value={inputText}
                onChange={({ target }) => {
                  setInputText(target.value);
                  setActiveIndex(0);
                  if (!searchable) {
                    setFilterable(false);
                  } else {
                    setFilterable(onSearch?.(target.value) !== false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Suffix aka clear and dropdown icon */}

      {suffixRender?.({
        clear: onClear,
        isOpen: show,
        showclear,
        loading,
      }) || (
        <div
          tabIndex={-1}
          className="zener-mx-1.5 zener-flex zener-flex-row zener-items-center gap-2 min-h-[24px] zener-opacity-40"
        >
          <Loading loading={loading && !show} />
          {showclear && !isDisabled && selectedOption.length > 0 && (
            <button
              aria-label="clear"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              tabIndex={-1}
              className="zener-outline-none zener-border-0 zener-opacity-80 hover:zener-opacity-100 zener-transition-all min-h-[24px]"
            >
              <CloseIcon size={16} />
            </button>
          )}
          <DropdownIcon size={18} />
        </div>
      )}

      {/* Popup list section */}
      <VirtualList
        loading={loading}
        bounds={bounds}
        noOptionMessage={noOptionMessage}
        createLabel={createLabel}
        animation={animation}
        groupRender={groupRender}
        menuRenderer={menuItemRender}
        ref={listRef}
        portalRef={portalRef}
        dialogRef={dialogRef}
        show={show && !noMenu}
        isActive={(v) => isActive(v)}
        isMultipleItemExists={(v) => isMultipleItemExists(v)}
        portalClass={portalClass}
        menuClass={menuClass}
        onClick={onItemClicked}
        onListFocus={() => {
          if (!(filterable || searchable || creatable)) {
            selectContainerRef.current?.focus();
          }
          inputRef.current?.focus();
        }}
        onPortalFocus={() => {
          inputRef.current?.focus();
        }}
        options={filteredOptions}
        selectedOption={selectedOption}
        onWheel={onWheel}
        onScroll={onScroll}
        onTouchMove={onTouchMove}
        maxMenuHeight={maxMenuHeight}
      />
    </div>
  );
};

const Select = <T, U extends boolean | undefined = undefined>(
  props: ISelect<T, U>,
) => {
  return (
    <ActiveIndexProvider>
      <SelectComponent {...props} />
    </ActiveIndexProvider>
  );
};

export default Select;
