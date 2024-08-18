import { ReactNode } from 'react';
import CloseIcon from './close-icon';
import { cn } from './utils';

interface ITag {
  children?: ReactNode;
  value: string;
  onClose?: (value: string) => void;
  disabled?: boolean;
}

const Tag = ({ children, disabled, value, onClose = (_) => _ }: ITag) => {
  return (
    <div
      tabIndex={-1}
      className={cn(
        'zener-flex zener-flex-row zener-items-center zener-gap-2 zener-rounded zener-px-2 zener-text-sm zener-h-full zener-mr-0.5 zener-ml-0 zener-z-10 zener-transition-all zener-truncate',
        {
          'zener-bg-[#f0f0f0]': !disabled,
          'zener-bg-black/5': !!disabled,
        },
      )}
    >
      <span className="zener-truncate">{children}</span>
      <span
        tabIndex={-1}
        className={cn({
          'zener-cursor-pointer zener-opacity-60 hover:zener-opacity-100':
            !disabled,
        })}
        onClick={(e) => {
          if (disabled) {
            return;
          }
          e.stopPropagation();
          e.preventDefault();
          onClose(value);
        }}
      >
        <CloseIcon size={12} />
      </span>
    </div>
  );
};

export default Tag;
