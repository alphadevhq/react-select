/* eslint-disable react/react-in-jsx-scope */
import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, motion } from 'framer-motion';
import List, { ListRef } from 'rc-virtual-list';
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import CloseIcon from './close-icon';
import './css/index.scss';
import DropdownIcon from './dropdown-icon';
import type { IOption } from './option';
import OptionRenderer from './option-renderer';
import Tag from './tag';
import { cn } from './utils';

interface ISelect {
  options?: Array<any>;
  virtual?: boolean;
  noOptionMessage?: ReactNode;
  multiple?: boolean;
  searchable?: boolean;
  // creatable?: boolean;
  suffix?: ReactNode;
  showclear?: boolean;
  children?: ReactElement<IOption> | Array<ReactElement<IOption>> | null;
}

const getPosition = (target: HTMLDivElement) => {
  const { left, top, height, width } = target.getBoundingClientRect();
  return { left, top, width, height };
};

const Select = ({
  options = [],
  virtual = true,
  multiple = false,
  searchable = false,
  noOptionMessage,
  // creatable = false,
  suffix = undefined,
  showclear = true,
  children,
}: ISelect) => {
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

  const [filteredOptions, _setFilteredOptions] = useState(options);
  const [customOptions, setCustomOptions] = useState<IOption[]>([]);

  const [selectedOption, setSelectedOption] = useState<Array<string>>([]);

  const [inputText, setInputText] = useState('');

  const [hoveredElement, setHoveredElement] = useState<Element>();

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

  const makeItemActive = () => {
    if (portalRef.current) {
      portalRef.current
        .querySelector('.option-item')
        ?.setAttribute('focused', 'true');
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

  // useEffect(() => {
  //   setFilteredOptions(options);
  // }, [options]);

  // useEffect(() => {
  //   const filtered = options.filter((opt) => opt.label.includes(inputText));
  //   if (creatable && filtered.length === 0) {
  //     filtered.push({ label: inputText, value: inputText });
  //   }
  //   setFilteredOptions(filtered);
  // }, [inputText, options, creatable]);

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
    setSelectedOption(selectedOption.filter((so) => so !== tag));
  };

  useEffect(() => {
    const x = React.Children.map(children, (child) => ({
      ...child?.props,
      key: child?.props.value,
    }));
    setCustomOptions(x as any);
  }, [children]);

  return (
    <>
      <div
        tabIndex={searchable ? -1 : 0}
        ref={selectContainerRef}
        className={cn(
          'byte-relative byte-flex byte-flex-row byte-items-center byte-py-0.5 byte-border byte-border-stone-200 byte-rounded byte-min-w-[50px] byte-outline-none focus:byte-ring-1 focus:byte-ring-blue-400',
          {
            'byte-cursor-text focus-within:byte-ring-1 focus-within:byte-ring-blue-400':
              searchable,
          }
        )}
        onClick={() => {
          setShow((prev) => !prev);
          inputRef.current?.focus();
          setInputBounding(
            getPosition(selectContainerRef.current as HTMLDivElement)
          );
        }}
        onBlur={(e) => {
          if (!portalRef?.current?.contains(e.relatedTarget) && show) {
            // setShow(false);
          }
        }}
        onKeyDown={(e) => {
          const { key } = e;
          console.log(e);

          if (['ArrowUp', 'ArrowDown'].includes(key)) {
            const optionItem = dialogRef.current?.querySelector(
              '.option-item[focused]'
            );
            if (optionItem) {
              if (key === 'ArrowDown') {
                if (optionItem.nextElementSibling) {
                  optionItem.removeAttribute('focused');
                  optionItem.nextElementSibling.setAttribute('focused', 'true');
                  setHoveredElement(optionItem.nextElementSibling);
                  optionItem.nextElementSibling.scrollIntoView({
                    block: 'end',
                  });
                }
              } else if (key === 'ArrowUp') {
                if (optionItem.previousElementSibling) {
                  optionItem.removeAttribute('focused');
                  optionItem.previousElementSibling.setAttribute(
                    'focused',
                    'true'
                  );
                  optionItem.previousElementSibling.scrollIntoView({
                    block: 'end',
                  });
                  setHoveredElement(optionItem.previousElementSibling);
                }
              }
            }
          }
        }}
      >
        <div className="byte-flex byte-flex-row byte-gap-0.5 byte-mx-0.5 byte-min-h-[24px] byte-items-center byte-cursor-default">
          {multiple &&
            selectedOption.map((so) => (
              <Tag
                key={so}
                value={so}
                onClose={(value) => {
                  removeTag(value);
                  inputRef.current?.focus();
                }}
              >
                {so}
              </Tag>
            ))}
          {!multiple && selectedOption.length > 0 && (
            <div
              className={cn({
                'byte-text-gray-400': show,
                hidden: show && !!inputText,
              })}
            >
              {selectedOption[0]}
            </div>
          )}
        </div>
        {searchable && (
          <input
            ref={inputRef}
            onKeyDown={(e) => {
              const key = e.key || `${e.keyCode}`;

              if (
                !inputText &&
                e.key === 'Backspace' &&
                multiple &&
                searchable
              ) {
                setSelectedOption((prev) => prev.slice(0, prev.length - 1));
              }
              if (key === 'Escape') {
                setShow(false);
              }
              if (!show && key.length < 2) {
                setShow(true);
              }
            }}
            className={cn('byte-flex-1 byte-outline-none', {
              'byte-absolute byte-bg-transparent byte-ml-0.5':
                !multiple && searchable,
            })}
            value={inputText}
            onChange={({ target }) => {
              setInputText(target.value);
            }}
          />
        )}
        {suffix === undefined ? (
          <div
            tabIndex={-1}
            className="byte-text-stone-400 byte-mx-1.5 byte-flex byte-flex-row byte-items-center gap-2 min-h-[24px]"
          >
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
      <AnimatePresence>
        {show && (
          <Portal
            ref={portalRef}
            tabIndex={-1}
            className="react-select-portal byte-absolute byte-z-[9999]"
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
              initial={{ opacity: 0, translateY: -5 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -5 }}
              ref={dialogRef}
              className={cn(
                'react-select-dialog byte-flex byte-flex-col byte-bg-white byte-rounded-lg byte-p-1 byte-z-50'
              )}
              style={{
                boxShadow:
                  '0 6px 16px 0 rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
              }}
            >
              <List
                data={customOptions}
                itemKey="key"
                fullHeight={false}
                virtual={virtual}
                height={200}
                itemHeight={30}
                tabIndex={-1}
                ref={listRef}
              >
                {({ children: child, label, value, className }) => {
                  const isActive = multiple
                    ? selectedOption.includes(value)
                    : value === selectedOption[0];
                  return (
                    <OptionRenderer
                      hoveredElement={hoveredElement}
                      className={className}
                      active={isActive}
                      onClick={() => {
                        inputRef.current?.focus();
                        if (!multiple) {
                          setSelectedOption([value]);
                        } else if (selectedOption.includes(value)) {
                          setSelectedOption(
                            selectedOption.filter((v) => v !== value)
                          );
                        } else {
                          setSelectedOption((prev) => [...prev, value]);
                        }
                        setInputText('');
                        if (!searchable) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();
                      }}
                      onFocus={(e) => {
                        e.preventDefault();
                        if (!searchable) {
                          selectContainerRef.current?.focus();
                        }
                        inputRef.current?.focus();
                      }}
                    >
                      {child || label}
                    </OptionRenderer>
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
