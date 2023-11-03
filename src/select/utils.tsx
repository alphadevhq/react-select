import classNames from 'classnames';

type Icn = (string | { [key: string]: boolean } | undefined)[];

export const cn = (...props: Icn) => {
  return classNames(...props);
};
