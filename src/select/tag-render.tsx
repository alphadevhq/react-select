/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ReactNode } from 'react';

/* eslint-disable react/jsx-no-useless-fragment */
export interface ITagRender {
  children?: ({
    remove,
    value,
    label,
  }: {
    remove: (value: string) => void;
    value: string;
    label: string;
  }) => ReactNode;
}
const TagRender = ({ children }: ITagRender) => {
  return null;
};

export default TagRender;
