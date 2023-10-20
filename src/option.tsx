/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ReactNode } from 'react';

export interface IOption {
  label: string;
  value: string;
  extra?: any;
  children: ReactNode;
  className?: string | ((isActive: boolean) => string);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const Option = ({ label, value, extra, children, className }: IOption) => {
  return <div>{children}</div>;
};

export default Option;
