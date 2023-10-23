import List, { ListRef } from 'rc-virtual-list';
import { ReactNode, Ref, forwardRef } from 'react';

interface IListRenderer<T> {
  data: Array<T>;
  itemKey: string;
  fullHeight: boolean;
  virtual?: boolean;
  children: (option: T) => ReactNode;
}
const ListRenderer = forwardRef(
  <T,>(
    {
      data,
      itemKey,
      fullHeight = true,
      virtual = true,
      children,
    }: IListRenderer<T>,
    ref: Ref<ListRef>
  ) => {
    return (
      <List
        tabIndex={-1}
        data={data}
        height={200}
        itemHeight={30}
        itemKey={itemKey}
        fullHeight={fullHeight}
        virtual={virtual}
        ref={ref}
      >
        {children}
      </List>
    );
  }
);

export default ListRenderer;
