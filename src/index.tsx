import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMS from 'react-dom/server';
import { cn } from './select/utils';
import Select from './select';

const _options = [
  {
    label: 'hello',
    value: 'hi',
    extra: { a: 'a' },
    render: ({ active, focused }) => (
      <div
        className={cn({
          'byte-bg-red-200': active,
          'byte-bg-green-200': focused,
        })}
      >
        dog
      </div>
    ),
  },
  {
    label: 'apple',
    value: 'apple',
    render: ({ active, focused }) => (
      <div
        className={cn({
          'byte-bg-red-200': active,
          'byte-bg-green-200': focused,
        })}
      >
        dog
      </div>
    ),
  },
  { label: 'ball', value: 'ball' },
  { label: 'c', value: 'd' },
  { label: 'd', value: 'e' },
  { label: 'f', value: 'g' },
  { label: 'h', value: 'i' },
  { label: 'hs', value: 'is' },
  { label: 'hsf', value: 'isf' },
  { label: 'hsdf', value: 'isfd' },
  { label: 'hsdf', value: 'isfd1' },
  { label: 'hsdf', value: 'isfd2' },
  { label: 'hsdf', value: 'isfd3' },
  { label: 'hsdf', value: 'isfd4' },
  { label: 'hsdf', value: 'isfd5' },
];

const _groupOptions = [
  {
    label: 'Group 1',
    options: [
      { label: 'ball', value: 'ball', extra: 'h' },
      { label: 'c', value: 'd' },
    ],
  },
  {
    label: 'Group 2',
    options: [
      { label: 'd', value: 'e' },
      { label: 'f', value: 'g' },
    ],
  },
];
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export function mapper<A, B>(
  array: A[],
  transform: (value: A, index: number) => B
): B[] {
  let _;
  return array.map(transform);
}

const _f = async () => {
  const x = await (
    await fetch('https://jsonplaceholder.typicode.com/todos')
  ).json();
  const k = mapper(x, (d: any) => ({
    label: `${d.title}`,
    value: `${d.id}`,
    extra: { a: 'h' },
  }));
  return k;
};

const _v = [
  {
    label: 'ball',
    value: 'ball',
    extra: {
      a: 'h',
      b: 'c',
    },
    render: ({ active, focused }) => (
      <div
        className={cn({
          'byte-bg-red-200': active,
          'byte-bg-green-200': focused,
        })}
      >
        dog
      </div>
    ),
  },
  {
    label: 'c',
    value: 'd',
    extra: {
      a: 'h',
    },
    render: () => <div>hi</div>,
  },
];
root.render(
  <div style={{ width: '200vw', height: '200vh' }}>
    <div style={{ width: '50vw', marginLeft: '300px', marginTop: '300px' }}>
      <Select
        // multiple
        searchable
        creatable
        value={_v[0]}
        // disabled
        onChange={(x) => {
          console.log(x);
        }}
        options={async () => _options}
        placeholder="hello"
        // className={() => ({
        //   default:
        //     'byte-text-sm byte-px-2 byte-py-0.5 byte-border byte-border-stone-200 byte-rounded byte-min-w-[50px] byte-outline-none',
        //   focus: 'byte-ring-1 byte-ring-orange-400',
        //   disabled: 'byte-text-black/25 byte-bg-black/5 byte-border-stone-100',
        // })}
        // menuItemRender={({ label, innerProps, active, focused }) => (
        //   <div
        //     {...innerProps}
        //     className={cn({
        //       'byte-bg-black/25': !!active,
        //       'byte-bg-stone-200': !!focused && !active,
        //     })}
        //   >
        //     {label}
        //   </div>
        // )}
      />
      <input
        value="helloi"
        className="byte-pt-3 byte-px-4 byte-border byte-mt-3"
      />
    </div>
  </div>
);

console.log(ReactDOMS.renderToString(<div>hello</div>));
