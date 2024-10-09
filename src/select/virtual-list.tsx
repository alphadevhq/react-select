import {
  ReactNode,
  RefObject,
  TouchEventHandler,
  UIEventHandler,
  WheelEventHandler,
  forwardRef,
  useLayoutEffect,
  useState,
} from 'react';
import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import {
  Virtualizer,
  VirtualizerHandle,
  CustomItemComponentProps,
} from 'virtua';
import OptionRenderer from './option-renderer';
import { cn } from './utils';
import useActiveIndex from './use-active-index';
import { IGroupRender, IMenuItemRender, ISelectedOption } from './select';
import { IOption } from './option';
import Loading from './loading';
import { IBounds } from './use-bounds';

const creatableSignatureLabel = '47ea1738-6a8e-4d87-88c1-f19e291d604e';
const creatableSignatureValue = '92a73c38-81c0-42e0-8182-8f9b006d7dc6';

const listHeight = 200;

type IListMenu = {
  show: boolean;
  menuClass?: string;
  portalClass?: string;
  options: any[];
  onPortalFocus: () => void;
  createLabel?: string;
  onClick: (data: any) => void;
  onListFocus: () => void;
  isActive: (value: string) => boolean;
  isMultipleItemExists: (value: string) => boolean; // is multiselect mode and current item is in selection list
  portalRef: RefObject<HTMLDivElement>;
  dialogRef: RefObject<HTMLDivElement>;
  animation?: null | AnimationProps;
  selectedOption: ISelectedOption<IOption>[];
  menuRenderer?: (value: IMenuItemRender) => ReactNode;
  groupRender?: (value: IGroupRender) => ReactNode;
  noOptionMessage?: ReactNode;
  loading: boolean;
  bounds: IBounds;
  onWheel?: WheelEventHandler<HTMLDivElement>;
  onScroll?: UIEventHandler<HTMLDivElement>;
  onTouchMove?: TouchEventHandler<HTMLDivElement>;
  maxMenuHeight?: number;
};

const ItemWrapper = forwardRef<HTMLDivElement, CustomItemComponentProps>(
  ({ children, style }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...style,
        }}
        className="zener-select-option-container"
        tabIndex={-1}
      >
        {children}
      </div>
    );
  },
);

const VirtualList = forwardRef<VirtualizerHandle, IListMenu>(
  (props, refProp) => {
    const {
      show,
      menuClass,
      portalClass,
      options,
      onPortalFocus,
      onListFocus,
      createLabel,
      onClick,
      isActive,
      isMultipleItemExists,
      portalRef,
      dialogRef,
      animation,
      selectedOption,
      menuRenderer,
      groupRender,
      noOptionMessage,
      loading,
      bounds,
      onWheel,
      onScroll,
      onTouchMove,
      maxMenuHeight,
    } = props;

    const { setActiveIndex } = useActiveIndex();

    const [isScrolling, setIsScrolling] = useState(false);

    useLayoutEffect(() => {
      if (!show || !refProp) return () => {};

      // make sure that when opening the menu the list is scrolled to first selected item if available.
      let currentActiveIndex = 0;
      const selectedItemIndex = options.findIndex(
        (f) => f.value === selectedOption?.[0]?.value,
      );
      if (selectedItemIndex !== -1) {
        currentActiveIndex = selectedItemIndex;
      }

      setActiveIndex(currentActiveIndex);

      const to = setTimeout(() => {
        if (refProp) {
          // @ts-ignore
          refProp.current?.scrollToIndex(currentActiveIndex || 0, {
            align: 'nearest',
          });
        }
      }, 0);
      return () => {
        clearTimeout(to);
      };
    }, [show, refProp]);

    return (
      <AnimatePresence>
        {show && (
          <Portal
            ref={portalRef}
            tabIndex={-1}
            className={cn(
              'react-select-portal zener-pointer-events-auto zener-absolute zener-mt-1',
              portalClass || 'zener-z-[9999999999999999999] zener-font-sans',
              'zener-select',
            )}
            onFocus={onPortalFocus}
            style={{
              left: bounds.left,
              top: bounds.top + bounds.height,
              minWidth: bounds.width,
              maxWidth: bounds.width,
            }}
          >
            <motion.div
              tabIndex={-1}
              className={cn(
                'react-select-dialog zener-overflow-y-auto zener-overscroll-y-none',
                menuClass ||
                  'zener-bg-white zener-rounded-md zener-shadow-menu zener-py-1',
              )}
              style={{
                maxHeight: maxMenuHeight || listHeight,
                height: 'fit-content',
              }}
              ref={dialogRef}
              {...(animation ||
                (animation === null
                  ? {}
                  : {
                      initial: { opacity: 0, translateY: -5 },
                      animate: { opacity: 1, translateY: 0 },
                      exit: { opacity: 0, translateY: -5 },
                      transition: { duration: 0.2 },
                    }))}
              onWheel={onWheel}
              onScroll={onScroll}
              onTouchMove={onTouchMove}
            >
              <Virtualizer
                overscan={10 /* overscan for keyboard */}
                ref={refProp}
                item={ItemWrapper}
                onScroll={() => {
                  setIsScrolling(true);
                  // needed to override pointerevents otherwise it is not letting click on item when scrolling
                  if (dialogRef.current) {
                    const virtuaDiv = dialogRef.current
                      .firstChild as HTMLDivElement;
                    if (virtuaDiv) {
                      virtuaDiv.style.pointerEvents = 'auto';
                    }
                  }
                }}
                onScrollEnd={() => {
                  setIsScrolling(false);
                }}
              >
                {options.map((option, index) => {
                  const data = option;
                  const { label, value, group, groupMode, disabled, render } =
                    data;
                  return (
                    <OptionRenderer
                      key={value}
                      dialogRef={dialogRef}
                      isScrolling={isScrolling}
                      disabled={disabled}
                      groupMode={!!groupMode}
                      group={group}
                      index={index}
                      itemRender={menuRenderer}
                      groupRender={groupRender}
                      active={isActive(value)}
                      onClick={() => {
                        onClick(data);
                      }}
                      onFocus={(e) => {
                        e.preventDefault();
                        onListFocus();
                      }}
                      render={
                        render ||
                        (() => {
                          if (
                            // @ts-ignore
                            data?.[creatableSignatureLabel] ===
                            creatableSignatureValue
                          ) {
                            if (isMultipleItemExists(value)) {
                              return label;
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
                })}
              </Virtualizer>
              {options.length === 0 &&
                !loading &&
                (noOptionMessage || (
                  <div className="zener-p-2 zener-self-center zener-text-center zener-flex zener-items-center zener-justify-center">
                    No options
                  </div>
                ))}
              {loading && options.length === 0 && (
                <div className="zener-p-2 zener-flex-col zener-gap-1 zener-self-center zener-text-center zener-flex zener-items-center zener-justify-center">
                  <Loading loading={loading} />
                  <span className="zener-text-sm">loading</span>
                </div>
              )}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    );
  },
);

export default VirtualList;
