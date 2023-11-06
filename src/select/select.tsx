/* eslint-disable react/react-in-jsx-scope */
import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import List, { ListRef } from 'rc-virtual-list';
import {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
// import scrollIntoView from 'scroll-into-view-if-needed';
import CloseIcon from './close-icon';
import DropdownIcon from './dropdown-icon';
import type { IGroupOption, IOption } from './option';
import OptionRenderer, { IOptionItem } from './option-renderer';
import SemiCircleIcon from './semi-circle-icon';
import Tag from './tag';
import type { ITagRender } from './tag-render';
import { cn } from './utils';

type ISelectedOption<T extends Record<string, any>> =
  | {
      label: string;
      value: string;
    }
  | T;

type ExtractOptionType<T, U> = T extends IGroupOption<IOption[] | T[]>
  ? U extends true
    ? T['options'][]
    : T['options'][number]
  : U extends true
  ? IOption[] & T
  : ExtractArrayType<IOption & T>;

type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

export interface ISelect<T, U> {
  options: () => Promise<T & (IOption[] | IGroupOption<IOption[] | T>[])>;
  virtual?: boolean;
  noOptionMessage?: ReactNode;
  placeholder?: ReactNode;
  multiple?: U;
  searchable?: boolean;
  creatable?: ReactNode;
  suffix?: ReactNode;
  showclear?: boolean;
  tagRender?: ReactElement<ITagRender>;
  menuItemRender?: ({ active, focused, innerProps }: IOptionItem) => ReactNode;
  className?: string;
  portalClass?: string;
  menuClass?: string;
  creatableClass?:
    | string
    | (() => { active: string; focus: string; default: string });
  animation?: null | AnimationProps;
  onChange?: (value: ExtractOptionType<T, U>) => void;
  value: ExtractOptionType<T, U> | undefined;
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

const Select = <T, U extends boolean | undefined = undefined>({
  options,
  multiple = false,
  virtual = true,
  searchable = false,
  noOptionMessage,
  creatable = false,
  suffix = undefined,
  showclear = true,
  portalClass,
  menuClass,
  tagRender,
  animation,
  onChange,
  value,
  menuItemRender,
  placeholder,
  className,
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

  const hiddenTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && flatOptions.length > 0) {
      let filteredArray = [];
      if (Array.isArray(value) && multiple) {
        filteredArray = flatOptions.filter((fo) =>
          value.find((v) => v?.value === fo.value)
        );

        setSelectedOption(filteredArray);
      } else {
        const v = value;
        // @ts-ignore
        const f = flatOptions.find((fo) => fo.value === v?.value);
        if (f) {
          filteredArray = [f];
          if (filteredArray.length > 0) {
            setSelectedOption(filteredArray);
          }
        }
      }
    }
    console.log(value);
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
      '.option-item-container[focused]'
    );
    if (optionItem) {
      setHoveredElement(optionItem);
    }
  }, [focusedElement]);

  const makeItemActive = () => {
    if (portalRef.current) {
      const hoveredEl = portalRef.current.querySelectorAll(
        '.option-item-container'
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
      inputRef.current?.focus();
    }
    if (show) {
      makeItemActive();
    }
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
              }))
          );

          setFlatOptions(filtered as any);
        } else {
          setFlatOptions(opt as IOption[]);
        }
      }
      setLoading(false);
    })();
  }, [options]);

  useEffect(() => {
    const filtered = flatOptions.filter((fot) => fot.label.includes(inputText));
    if (filtered.length === 0 && creatable) {
      filtered.push({ label: inputText, value: inputText });
    }
    setFilteredOptions(filtered);
  }, [inputText, flatOptions, creatable]);

  useEffect(() => {
    makeItemActive();
  }, [filteredOptions]);

  useEffect(() => {
    const holder = portalRef.current?.querySelector(
      '.rc-virtual-list-holder'
    ) as HTMLDivElement;
    if (holder) {
      holder.style.maxHeight = '200px';
      holder.style.height = 'auto';
    }
  }, [portalRef.current]);

  const removeTag = (tag: string) => {
    setSelectedOption(selectedOption.filter((so) => so.value !== tag));
    inputRef.current?.focus();
  };

  useEffect(() => {
    onChange?.((multiple ? selectedOption : selectedOption?.[0]) as any);
  }, [selectedOption]);

  const [w, setW] = useState(4);
  useEffect(() => {
    setW(Math.max(4, hiddenTextRef.current?.clientWidth || 0) + 20);
  }, [inputText]);

  useEffect(() => {
    if (selectContainerRef && selectContainerRef.current) {
      setInputBounding(getPosition(selectContainerRef.current));
    }
  }, [inputText, w, selectedOption]);

  return (
    <>
      <div
        tabIndex={searchable || creatable ? -1 : 0}
        ref={selectContainerRef}
        className={cn(
          'byte-relative byte-flex byte-flex-row byte-items-center',
          {
            'byte-cursor-text': searchable || !!creatable,
          },
          className ||
            'byte-text-sm byte-px-2 byte-py-0.5 byte-border byte-border-stone-200 byte-rounded byte-min-w-[50px] byte-outline-none focus:byte-ring-1 focus:byte-ring-blue-400 focus-within:byte-ring-1 focus-within:byte-ring-blue-400'
        )}
        onClick={() => {
          setShow((prev) => !prev);
          inputRef.current?.focus();
          setInputBounding(
            getPosition(selectContainerRef.current as HTMLDivElement)
          );
        }}
        onBlur={(e) => {
          if (
            !portalRef?.current?.contains(e.relatedTarget) &&
            !selectContainerRef.current?.contains(e.relatedTarget) &&
            show
          ) {
            setShow(false);
          }
        }}
        onKeyDown={(e) => {
          const { key } = e;

          if (['ArrowUp', 'ArrowDown'].includes(key)) {
            console.log(selectContainerRef.current?.getBoundingClientRect());

            e.preventDefault();
            if (!show) {
              setShow(true);
            }

            const optionItem = dialogRef.current?.querySelector(
              '.option-item-container[focused]'
            );
            if (optionItem) {
              if (key === 'ArrowDown') {
                if (optionItem.nextElementSibling) {
                  optionItem.removeAttribute('focused');
                  optionItem.nextElementSibling.setAttribute('focused', 'true');
                  setHoveredElement(optionItem.nextElementSibling);

                  listRef.current?.scrollTo({
                    key: optionItem.getAttribute('data-value') || '',
                    align: 'top',
                    offset: optionItem.clientHeight,
                  });
                }
              } else if (key === 'ArrowUp') {
                if (optionItem.previousElementSibling) {
                  optionItem.removeAttribute('focused');
                  optionItem.previousElementSibling.setAttribute(
                    'focused',
                    'true'
                  );

                  listRef.current?.scrollTo({
                    key: optionItem.getAttribute('data-value') || '',
                    align: 'bottom',
                    offset: optionItem.clientHeight,
                  });

                  setHoveredElement(optionItem.previousElementSibling);
                }
              }
            }
          }

          if (e.code === 'Space' && e.ctrlKey) {
            setShow(true);
          }

          if (key === 'Enter' && show) {
            setEnterPressed((prev) => !prev);
          }

          if (key === 'Escape') {
            setShow(false);
          }
        }}
      >
        <div
          className={cn(
            'byte-flex-wrap byte-overflow-hidden byte-flex-1 ',
            'byte-flex byte-flex-row byte-gap-0.5 byte-mx-0.5 byte-min-h-[24px] byte-items-center byte-cursor-default',
            {
              'byte-flex-1': !multiple,
              'byte-cursor-text': searchable || !!creatable,
            },
            multiple && selectedOption.length > 0 ? '-byte-ml-1' : ''
          )}
        >
          {/* Tag section for multiple selection mode */}

          {multiple &&
            selectedOption.map(
              (so) =>
                (tagRender &&
                  tagRender?.props?.children?.({
                    remove: removeTag,
                    value: so.value,
                    label: so.label,
                  })) || (
                  <Tag
                    key={so.value}
                    value={so.value}
                    onClose={(value) => {
                      removeTag(value);
                    }}
                  >
                    {so.label}
                  </Tag>
                )
            )}
          {!multiple && selectedOption.length > 0 && (
            <div
              className={cn({
                'byte-text-gray-400 byte-transition-all': show,
                hidden: show && !!inputText,
              })}
            >
              {selectedOption[0].label}
            </div>
          )}

          {/* Placeholder */}

          {typeof placeholder === 'string' ? (
            <div
              className={cn(
                'byte-text-black/20 byte-absolute byte-left-0 byte-px-2.5',
                placeholder && !inputText && selectedOption.length === 0
                  ? 'byte-opacity-100'
                  : 'byte-opacity-0'
              )}
            >
              {placeholder}
            </div>
          ) : (
            <div
              className={cn(
                'byte-absolute byte-left-0 byte-px-2.5',
                placeholder && !inputText && selectedOption.length === 0
                  ? 'byte-opacity-100'
                  : 'byte-opacity-0'
              )}
            >
              {placeholder}
            </div>
          )}

          {/* Input field for searchable or creatable mode */}

          {(searchable || creatable) && (
            <div
              style={{
                width: w,
              }}
            >
              <div
                ref={hiddenTextRef}
                className="byte-invisible byte-h-0 byte-overflow-hidden byte-w-fit"
              >
                {inputText}
              </div>
              <input
                autoComplete="off"
                ref={inputRef}
                onKeyDown={(e: KeyboardEvent) => {
                  const key = e.key || `${e.keyCode}`;

                  if (
                    !inputText &&
                    key === 'Backspace' &&
                    multiple &&
                    (searchable || creatable)
                  ) {
                    setSelectedOption((prev) => prev.slice(0, prev.length - 1));
                  }

                  if (e.code === 'Space' && e.ctrlKey) {
                    setShow(true);
                  }
                }}
                onKeyUp={() => {
                  const reg = /^[0-9a-zA-Z@]+$/;
                  if (!show && inputRef.current?.value.match(reg)) {
                    setShow(true);
                  }
                }}
                className={cn('byte-outline-none byte-w-full min-w-[4.1px]', {
                  'byte-absolute byte-bg-transparent byte-ml-0.5':
                    !multiple && (searchable || !!creatable),
                })}
                value={inputText}
                onChange={({ target }) => {
                  setInputText(target.value);
                }}
              />
            </div>
          )}
        </div>

        {/* Suffix aka clear and dropdown icon */}

        {suffix === undefined ? (
          <div
            tabIndex={-1}
            className="byte-text-stone-400 byte-mx-1.5 byte-flex byte-flex-row byte-items-center gap-2 min-h-[24px]"
          >
            {loading && (
              <div className="byte-animate-spin">
                <SemiCircleIcon size={16} />
              </div>
            )}
            {showclear && selectedOption.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOption([]);
                  inputRef.current?.focus();
                }}
                tabIndex={-1}
                className="byte-outline-none hover:byte-text-stone-500 byte-transition-all min-h-[24px]"
              >
                <CloseIcon size={16} />
              </button>
            )}
            <DropdownIcon size={18} />
          </div>
        ) : (
          suffix
        )}
      </div>

      {/* Popup list section */}

      <AnimatePresence>
        {show && (
          <Portal
            ref={portalRef}
            tabIndex={-1}
            className={cn(
              'react-select-portal byte-pointer-events-auto',
              portalClass || 'byte-absolute byte-z-[9999999999999999999]'
            )}
            onClick={() => {
              if (!multiple) {
                setShow(false);
              }
            }}
            onFocus={() => {
              inputRef.current?.focus();
            }}
            style={{
              left: inputBounding.left,
              top: inputBounding.top + inputBounding.height + offsetVertical,
              minWidth: inputBounding.width,
            }}
          >
            <motion.div
              tabIndex={-1}
              className={cn(
                'relative byte-z-[99999999999999999999] react-select-dialog byte-flex byte-flex-col ',
                menuClass ||
                  'byte-bg-white byte-rounded-lg byte-p-1 byte-shadow-menu'
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
              >
                {(data) => {
                  const { label, value, render, group, groupMode } = data;
                  const selectValue = { ...data };
                  delete selectValue.group;
                  delete selectValue.groupMode;
                  delete selectValue.render;

                  const findElement = selectedOption.find(
                    (so) => so.value === value
                  );
                  const isActive = multiple
                    ? !!findElement
                    : value === selectedOption[0]?.value;
                  return (
                    <OptionRenderer
                      groupMode={!!groupMode}
                      itemRender={menuItemRender}
                      group={group}
                      onFocusChanges={() => setFocusedElement(value)}
                      enterPressed={enterPressed}
                      hoveredElement={hoveredElement}
                      active={isActive}
                      onClick={() => {
                        inputRef.current?.focus();
                        if (!multiple) {
                          setSelectedOption([selectValue]);
                          setShow(false);
                        } else if (findElement) {
                          setSelectedOption(
                            selectedOption.filter((v) => v.value !== value)
                          );
                        } else {
                          setSelectedOption((prev) => [...prev, selectValue]);
                        }
                        setInputText('');
                        if (!(searchable || creatable)) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();
                      }}
                      onFocus={(e) => {
                        e.preventDefault();
                        if (!(searchable || creatable)) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();
                      }}
                      render={render || label}
                      label={label}
                      value={value}
                    />
                  );
                }}
              </List>
              {filteredOptions.length === 0 &&
                (noOptionMessage || (
                  <div className="byte-p-2 byte-self-center byte-text-center byte-flex byte-items-center byte-justify-center">
                    No options
                  </div>
                ))}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Select;
