/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import List, { ListRef } from 'rc-virtual-list';
import {
  Dispatch,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import CloseIcon from './close-icon';
import DropdownIcon from './dropdown-icon';
import type { IGroupOption, IOption } from './option';
import OptionRenderer, { IOptionItem } from './option-renderer';
import Tag from './tag';
import { cn } from './utils';
import Loading from './loading';
import useTypehead from './typeahead';

const creatableSignatureLabel = '47ea1738-6a8e-4d87-88c1-f19e291d604e';
const creatableSignatureValue = '92a73c38-81c0-42e0-8182-8f9b006d7dc6';

type ISelectedOption<T extends Record<string, any>> =
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
  virtual?: boolean;
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
}

const getPosition = (target: HTMLDivElement) => {
  const { left, top, height, width } = target.getBoundingClientRect();
  return {
    left: left + window.pageXOffset,
    top: top + window.pageYOffset,
    width,
    height,
  };
};

const navigateItem = ({
  nextItem,
  currentItem,
  menuItemRender,
  listRef,
  setHoveredElement,
}: {
  nextItem: Element | null;
  currentItem: Element | null;
  menuItemRender: ISelect<null, null>['menuItemRender'];
  listRef: ListRef | null;
  setHoveredElement: Dispatch<SetStateAction<Element | undefined>>;
}) => {
  if (nextItem) {
    currentItem?.removeAttribute('focused');
    nextItem.setAttribute('focused', 'true');
    setHoveredElement(nextItem);

    if (!menuItemRender) {
      const data = nextItem?.getAttribute('data-value') || '';
      const dataType = nextItem.getAttribute('data-type') || 'string';
      listRef?.scrollTo({
        key: dataType === 'number' ? parseInt(data, 10) : data,
        align: 'auto',
      });
    }
  }
};

const Select = <T, U extends boolean | undefined = undefined>({
  options,
  multiple = false,
  disabled = false,
  virtual = true,
  open = undefined,
  noOptionMessage,
  disableWhileLoading,
  creatable = false,
  suffixRender,
  showclear = false,
  portalClass,
  menuClass,
  tagRender,
  animation,
  onChange,
  value,
  menuItemRender,
  placeholder,
  className,
  valueRender,
  groupRender,
  onOpenChange,
  onSearch,
  searchable = true,
  createLabel,
  tabIndex,
  noMenu,
}: ISelect<T, U>) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [inputBounding, setInputBounding] = useState({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });
  const [show, setShow] = useState(false);
  const [offsetVertical] = useState(5);
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

  const [hoveredElement, setHoveredElement] = useState<Element>();

  const [enterPressed, setEnterPressed] = useState(false);
  const [focusedElement, setFocusedElement] = useState('');
  const [filterable, setFilterable] = useState(searchable);

  const hiddenTextRef = useRef<HTMLDivElement>(null);
  const currentItemPositionRef = useRef<number>(0);

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

  useEffect(() => {
    setInputBounding(getPosition(selectContainerRef.current as HTMLDivElement));
    const resizeListener = () => {
      if (selectContainerRef && selectContainerRef.current) {
        setInputBounding(getPosition(selectContainerRef.current));
      }
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  useEffect(() => {
    const optionItem = dialogRef.current?.querySelector(
      '.option-item-container[focused]',
    );
    if (optionItem) {
      setHoveredElement(optionItem);
    }
  }, [focusedElement]);

  const makeItemActive = () => {
    if (portalRef.current) {
      const hoveredEl = portalRef.current.querySelectorAll(
        '.option-item-container',
      );
      hoveredEl.forEach((hl, index) => {
        if (index === 0) {
          hl.setAttribute('focused', 'true');
          setHoveredElement(hl);
        } else {
          hl.removeAttribute('focused');
        }
      });
    }
  };

  useEffect(() => {
    if (!show) {
      setInputText('');
    }
    if (show) {
      listRef.current?.scrollTo({
        index: currentItemPositionRef.current,
        align: 'top',
      });
      makeItemActive();
      inputRef.current?.focus();
    }

    setInputBounding(getPosition(selectContainerRef.current as HTMLDivElement));
    onOpenChange?.(show);
  }, [show]);

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

  useEffect(() => {
    makeItemActive();
  }, [filteredOptions]);

  useEffect(() => {
    const holder = portalRef.current?.querySelector(
      '.rc-virtual-list-holder',
    ) as HTMLDivElement;
    if (holder) {
      holder.style.maxHeight = '200px';
      holder.style.height = 'auto';
    }
  }, [portalRef.current]);

  // get value based on multiple or single selection
  const getVal = (data: ISelectedOption<IOption>[]) => {
    return (multiple ? data : data?.[0]) as any;
  };

  const removeTag = (tag: string) => {
    const val = getVal(selectedOption.filter((so) => so.value !== tag));
    setSelectedOption(val);
    // @ts-ignore
    onChange?.(val as any, val?.map((v) => v.value) || ([] as any));
    selectContainerRef.current?.focus();
    inputRef.current?.focus();

    if (Array.isArray(val) && val.length > 0) scrollToSelected(val?.[0].value);
    else currentItemPositionRef.current = 0;
  };

  const [w, setW] = useState(4);

  useEffect(() => {
    setW(Math.max(4, hiddenTextRef.current?.clientWidth || 0));
    listRef.current?.scrollTo({
      index: 0,
      align: 'top',
    });
  }, [inputText]);

  // set the bounding rect of menu
  useEffect(() => {
    if (selectContainerRef && selectContainerRef.current) {
      setInputBounding(getPosition(selectContainerRef.current));
    }
  }, [inputText, w, selectedOption]);

  // set disable state for select
  useEffect(() => {
    setIsDisabled(disabled || (disableWhileLoading && loading) || false);
    selectContainerRef.current?.setAttribute('disabled', `${disabled}`);
  }, [disabled, disableWhileLoading, loading]);

  // make menu hidden if disabled
  useEffect(() => {
    if (isDisabled) {
      setShow(false);
    } else {
      setShow(!!open);
    }
  }, [open, isDisabled]);

  useEffect(() => {
    if (menuItemRender && hoveredElement) {
      const data = hoveredElement.getAttribute('data-value') || '';
      const dataType = hoveredElement.getAttribute('data-type') || 'string';
      listRef.current?.scrollTo({
        key: dataType === 'number' ? parseInt(data, 10) : data,
        align: 'auto',
      });
    }
  }, [hoveredElement, menuItemRender]);

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

  const closeList = () => {
    if (open === undefined) {
      setShow(false);
    }
  };

  const onClear = () => {
    setSelectedOption([]);
    onChange?.([] as any, [] as any);
    inputRef.current?.focus();
    closeList();
    currentItemPositionRef.current = 0;
  };

  const scrollToSelected = (val: string) => {
    let currentIndex = currentItemPositionRef.current;
    // @ts-ignore
    currentIndex = flatOptions.findIndex(
      (fo) =>
        // @ts-ignore
        fo.value === val,
    );
    currentItemPositionRef.current = currentIndex;
  };

  // typeahead feature
  const { selectedIndex } = useTypehead({
    element: selectContainerRef.current,
    items: flatOptions,
    enabled: !creatable && !searchable && show,
  });

  useEffect(() => {
    listRef.current?.scrollTo({
      index: selectedIndex,
      align: 'auto',
    });

    setTimeout(() => {
      if (portalRef.current) {
        const hoveredEl = portalRef.current.querySelectorAll(
          '.option-item-container',
        );
        hoveredEl.forEach((hl) => {
          if (
            `${hl.getAttribute('data-value')}` ===
            `${filteredOptions[selectedIndex]?.value}`
          ) {
            hl.setAttribute('focused', 'true');
            setHoveredElement(hl);
          } else {
            hl.removeAttribute('focused');
          }
        });
      }
    }, 50);
  }, [selectedIndex]);

  // no menu option
  const handleNoMenuMode = (e: KeyboardEvent) => {
    console.log(selectedOption);
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

  return (
    <>
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
                'zener-font-sans zener-bg-white zener-text-sm zener-px-2 zener-py-0.5 zener-border-solid zener-border zener-border-stone-200 zener-rounded zener-min-w-[50px] zener-outline-none focus:zener-ring-1 focus:zener-ring-blue-400 focus-within:zener-ring-1 focus-within:zener-ring-blue-400',
        )}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (!isDisabled) {
            if (show) {
              closeList();
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
            closeList();
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
          const { key } = e;

          if (['ArrowUp', 'ArrowDown'].includes(key)) {
            e.preventDefault();
            if (!show) {
              setShow(true);
            }

            const optionItem = dialogRef.current?.querySelector(
              '.option-item-container[focused]',
            );
            if (optionItem) {
              if (key === 'ArrowDown') {
                const item = optionItem.nextElementSibling;
                navigateItem({
                  nextItem: item,
                  currentItem: optionItem,
                  menuItemRender,
                  listRef: listRef.current,
                  setHoveredElement,
                });
              } else if (key === 'ArrowUp') {
                const item = optionItem.previousElementSibling;
                navigateItem({
                  nextItem: item,
                  currentItem: optionItem,
                  menuItemRender,
                  listRef: listRef.current,
                  setHoveredElement,
                });
              }
            } else {
              makeItemActive();
            }
          }

          if (e.code === 'Space' && e.ctrlKey) {
            setShow(true);
          }

          if (key === 'Enter' && show) {
            e.stopPropagation();
            e.preventDefault();
            setEnterPressed((prev) => !prev);
          }

          if (key === 'Escape') {
            closeList();
          }
        }}
      >
        <div
          className={cn(
            'zener-flex-1 zener-overflow-hidden zener-relative',
            'zener-flex zener-flex-row zener-gap-0.5 zener-mx-0.5 zener-min-h-[24px]',
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

          {selectedOption.length > 0 ? null : typeof placeholder ===
            'string' ? (
            <div
              className={cn(
                'zener-text-black/20 zener-absolute zener-left-0 zener-transition-all zener-flex zener-items-center zener-min-h-[24px]',
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
                    const key = e.key || `${e.keyCode}`;

                    if (
                      !inputText &&
                      key === 'Backspace' &&
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

                    if (e.code === 'Space' && e.ctrlKey) {
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
      </div>

      {/* Popup list section */}

      <AnimatePresence>
        {show && !noMenu && (
          <Portal
            ref={portalRef}
            tabIndex={-1}
            className={cn(
              'react-select-portal zener-pointer-events-auto',
              portalClass ||
                'zener-absolute zener-z-[9999999999999999999] zener-font-sans',
              'zener-select',
            )}
            onFocus={() => {
              inputRef.current?.focus();
            }}
            style={{
              left: inputBounding.left,
              top: inputBounding.top + inputBounding.height + offsetVertical,
              minWidth: inputBounding.width,
              maxWidth: inputBounding.width,
            }}
          >
            <motion.div
              tabIndex={-1}
              className={cn(
                'relative zener-z-[99999999999999999999] react-select-dialog zener-flex zener-flex-col ',
                menuClass ||
                  'zener-bg-white zener-rounded-lg zener-p-1 zener-shadow-menu',
              )}
              {...(animation ||
                (animation === null
                  ? {}
                  : {
                      initial: { opacity: 0, translateY: -5 },
                      animate: { opacity: 1, translateY: 0 },
                      exit: { opacity: 0, translateY: -5 },
                      transition: { duration: 0.2 },
                    }))}
              ref={dialogRef}
            >
              <List
                data={filteredOptions}
                itemKey="value"
                fullHeight={false}
                virtual={virtual}
                height={200}
                itemHeight={30}
                tabIndex={-1}
                ref={listRef}
                className="zener-select"
              >
                {(data) => {
                  const { label, value, render, group, groupMode, disabled } =
                    data;
                  const selectValue = { ...data };
                  delete selectValue.group;
                  delete selectValue.groupMode;
                  delete selectValue.render;

                  const findElement = selectedOption.find(
                    (so) => so.value === value,
                  );

                  const isActive = multiple
                    ? !!findElement
                    : value === selectedOption[0]?.value;

                  return (
                    <OptionRenderer
                      disabled={disabled}
                      groupRender={groupRender}
                      groupMode={!!groupMode}
                      itemRender={menuItemRender}
                      group={group}
                      onFocusChanges={() => setFocusedElement(value)}
                      enterPressed={enterPressed}
                      hoveredElement={hoveredElement}
                      active={isActive}
                      onClick={() => {
                        if (disabled) {
                          return;
                        }

                        inputRef.current?.focus();
                        // @ts-ignore
                        let val;

                        if (!multiple) {
                          val = selectValue;
                          if (creatable) {
                            setSelectedOption([val]);
                          }
                          closeList();
                        } else if (findElement) {
                          val = selectedOption.filter((v) => v.value !== value);
                          if (creatable) {
                            setSelectedOption(val);
                          }
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

                        // for auto scrolling to first selected element

                        scrollToSelected(
                          // @ts-ignore
                          multiple && val.length > 0
                            ? // @ts-ignore
                              val[0]?.value
                            : // @ts-ignore
                              val.value,
                        );
                        if (
                          creatable &&
                          filteredOptions.length === 1 &&
                          inputText !== ''
                        ) {
                          closeList();
                        }

                        setInputText('');
                        if (!(filterable || searchable || creatable)) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();

                        if (!multiple && !disabled) {
                          closeList();
                        }
                      }}
                      onFocus={(e) => {
                        e.preventDefault();
                        if (!(filterable || searchable || creatable)) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();
                      }}
                      render={
                        render ||
                        (() => {
                          if (
                            // @ts-ignore
                            data?.[creatableSignatureLabel] ===
                            creatableSignatureValue
                          ) {
                            if (findElement?.value === data.value && multiple) {
                              return `${label}`;
                            }

                            if (createLabel) {
                              return `${createLabel} "${label}"`;
                            }
                            return `Create "${label}"`;
                          }
                          return label;
                        })
                      }
                      label={label}
                      value={value}
                    />
                  );
                }}
              </List>
              {filteredOptions.length === 0 &&
                !loading &&
                (noOptionMessage || (
                  <div className="zener-p-2 zener-self-center zener-text-center zener-flex zener-items-center zener-justify-center">
                    No options
                  </div>
                ))}
              {loading && filteredOptions.length === 0 && (
                <div className="zener-p-2 zener-flex-col zener-gap-1 zener-self-center zener-text-center zener-flex zener-items-center zener-justify-center">
                  <Loading loading={loading} />
                  <span className="zener-text-sm">loading</span>
                </div>
              )}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Select;
