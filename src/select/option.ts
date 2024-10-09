/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ReactNode } from 'react';

export interface IOption {
  label: string;
  value: string;
  disabled?: () => boolean | boolean;
  render?: ({
    active,
    focused,
  }: {
    active: boolean;
    focused: boolean;
  }) => ReactNode;
}

export interface IGroupOption<T> {
  label: string;
  options: Array<IOption> | T;
}
