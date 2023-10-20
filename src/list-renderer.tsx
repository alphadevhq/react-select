import List from 'rc-virtual-list';
import { ReactNode } from 'react';

interface IListRenderer<T> {
  data: Array<T>;
  itemKey: string;
  fullHeight: boolean;
  virtual?: boolean;
  children: (option: T) => ReactNode;
}
const ListRenderer = <T,>({
  data,
  itemKey,
  fullHeight = true,
  virtual = true,
  children,
}: IListRenderer<T>) => {
  return (
    <List
      tabIndex={-1}
      data={data}
      height={200}
      itemHeight={30}
      itemKey={itemKey}
      fullHeight={fullHeight}
      virtual={virtual}
    >
      {children}
    </List>
  );
};

export default ListRenderer;
