import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMS from 'react-dom/server';
import { cn } from './select/utils';
import Select, { IOptionItem } from './select';

const _options = [
  {
    label: 'hello',
    value: 'hi',
    extra: { a: 'a' },
    render: ({ active, focused }) => (
      <div
        className={cn({
          'zener-bg-red-200': active,
          'zener-bg-green-200': focused,
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
          'zener-bg-red-200': active,
          'zener-bg-green-200': focused,
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
    await fetch('https://jsonplaceholder.typicode.com/photos')
  ).json();
  const k = mapper(x, (d: any) => ({
    label: `${d.title}`,
    value: `${d.id}`,
    extra: { a: 'h', url: d.thumbnailUrl },
  }));
  return [...k];
};

const _country = async () => {
  const x = await (
    await fetch(
      'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json'
    )
  ).json();
  const k = mapper(x, (d: any) => ({
    label: `${d.name}`,
    value: `${d.code}`,
    render: () => (
      <div className="zener-flex zener-flex-row zener-items-center zener-gap-1 zener-truncate">
        {/* <img src={d.image} alt={d.name} className="zener-w-5 zener-h-5" /> */}
        <span>{d.emoji}</span>
        <span className="zener-truncate">{d.name}</span>
      </div>
    ),
    extra: { image: d.image, emoji: d.emoji },
  }));
  return [...k];
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
          'zener-bg-red-200': active,
          'zener-bg-green-200': focused,
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

const _MenuRenderer = ({ label, innerProps, active, focused }: IOptionItem) => {
  return (
    <div
      {...innerProps}
      className={cn('zener-py-2 zener-px-1', {
        'zener-bg-black/25': !!active,
        'zener-bg-stone-200': !!focused && !active,
        'zener-bg-red-200': !active && !focused,
      })}
    >
      {label}
    </div>
  );
};

root.render(
  <div style={{ width: '200vw', height: '200vh' }}>
    <div style={{ width: '50vw', marginLeft: '300px', marginTop: '300px' }}>
      <Select
        // multiple
        // searchable
        // virtual={false}
        // creatable
        value={undefined}
        disableWhileLoading
        // disabled

        onChange={(x) => {
          console.log(x);
        }}
        // open
        // disabled
        valueRender={({ label, extra }) => (
          <div className="zener-flex zener-flex-row zener-gap-1 zener-items-center zener-truncate">
            <img
              className="zener-w-5 zener-h-5 zener-rounded"
              src={extra.image}
              alt={label}
            />
            <span className="zener-truncate">{label}</span>
          </div>
        )}
        options={_country}
        placeholder="hello"
        // tagRender={({ label }) => {
        //   return (
        //     <div className="zener-bg-blue-200 zener-rounded zener-p-1 zener-truncate">
        //       {label}
        //     </div>
        //   );
        // }}
        className={() => {
          const c =
            'zener-text-sm zener-px-2 zener-py-0.5 zener-border zener-rounded zener-min-w-[50px] zener-outline-none';
          return {
            default: `${c} zener-border-stone-200`,
            focus: `${c} zener-border-stone-200 zener-ring-1 zener-ring-orange-400`,
            disabled: `${c} zener-text-black/25 zener-bg-black/5 zener-border-stone-100`,
          };
        }}
        // menuItemRender={_MenuRenderer}
      />
      <input
        value="helloi"
        className="zener-pt-3 zener-px-4 zener-border zener-mt-3"
      />
    </div>
  </div>
);

console.log(ReactDOMS.renderToString(<div>hello</div>));
