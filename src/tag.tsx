import { ReactNode } from 'react';
import CloseIcon from './close-icon';

interface ITag {
  children?: ReactNode;
  value: string;
  onClose?: (value: string) => void;
}

const Tag = ({ children, value, onClose = (_) => _ }: ITag) => {
  return (
    <div
      tabIndex={-1}
      className="byte-flex byte-flex-row byte-items-center byte-gap-2 byte-bg-[#f0f0f0] byte-rounded byte-px-2 byte-text-sm byte-h-6 byte-mr-0.5 byte-ml-0"
    >
      {children}
      <span
        tabIndex={-1}
        className="byte-cursor-pointer byte-opacity-60 hover:byte-opacity-100"
        onClick={(e) => {
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
