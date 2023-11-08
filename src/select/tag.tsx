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
        'byte-flex byte-flex-row byte-items-center byte-gap-2 byte-rounded byte-px-2 byte-text-sm byte-h-6 byte-mr-0.5 byte-ml-0 byte-z-10 byte-transition-all',
        {
          'byte-bg-[#f0f0f0]': !disabled,
          'byte-bg-black/5': !!disabled,
        }
      )}
    >
      <span className="byte-line-clamp-1">{children}</span>
      <span
        tabIndex={-1}
        className={cn({
          'byte-cursor-pointer byte-opacity-60 hover:byte-opacity-100':
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
