/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import ReactDOM from 'react-dom/client';
import ReactDOMS from 'react-dom/server';
import { useEffect, useRef, useState } from 'react';
import { cn } from './select/utils';
import Select, { IOptionItem } from './select';

const _options = [
  {
    label: 'hello',
    value: 'hi',
    extra: { a: 'a' },
  },
  {
    label: 'apple',
    value: 'apple',
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
  {
    label: 'Group 3',
    options: [
      { label: 'd', value: 'e1' },
      { label: 'f', value: 'g1' },
    ],
  },
  {
    label: 'Group 4',
    options: [
      { label: 'd', value: 'e2' },
      { label: 'f', value: 'g2' },
    ],
  },
  {
    label: 'Group 5',
    options: [
      { label: 'd', value: 'e3' },
      { label: 'f', value: 'g3' },
    ],
  },
  {
    label: 'Group 6',
    options: [
      { label: 'd', value: 'e4' },
      { label: 'f', value: 'g4' },
    ],
  },
  {
    label: 'Group 7',
    options: [
      { label: 'd', value: 'e5' },
      { label: 'f', value: 'g5' },
    ],
  },
  {
    label: 'Group 8',
    options: [
      { label: 'd', value: 'e6' },
      { label: 'f', value: 'g6' },
    ],
  },
  {
    label: 'Group 9',
    options: [
      { label: 'd', value: 'e7' },
      { label: 'f', value: 'g7' },
    ],
  },
  {
    label: 'Group 10',
    options: [
      { label: 'd', value: 'e8' },
      { label: 'f', value: 'g8' },
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
  const data = await (
    await fetch(
      'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json'
    )
  ).json();

  return [
    ...data.map((country: any) => ({
      label: `${country.name}`,
      value: `${country.code}`,
      render: () => (
        <div className="zener-flex zener-flex-row zener-items-center zener-gap-1 zener-truncate">
          <span>{country.emoji}</span>
          <span className="zener-truncate">{country.name}</span>
        </div>
      ),
      country,
    })),
  ];
};

// const _v = [
//   {
//     label: 'ball',
//     value: 'ball',
//     extra: {
//       a: 'h',
//       b: 'c',
//     },
//     render: ({ active, focused }) => (
//       <div
//         className={cn({
//           'zener-bg-red-200': active,
//           'zener-bg-green-200': focused,
//         })}
//       >
//         dog
//       </div>
//     ),
//   },
//   {
//     label: 'c',
//     value: 'd',
//     extra: {
//       a: 'h',
//     },
//     render: () => <div>hi</div>,
//   },
// ];

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

const _group = [{ label: 'group', options: [{ label: 'hello', value: 'hi' }] }];

const App = () => {
  const ref = useRef(null);
  // useEffect(() => {
  //   if (ref.current) {
  //     const observer = new IntersectionObserver((data) => {
  //       console.log(data);
  //     });

  //     observer.observe(ref.current);
  //     return () => observer.disconnect();
  //   }
  //   return () => {};
  // }, []);
  return (
    <div>
      <input
        ref={ref}
        value="helloi"
        className="zener-pt-3 zener-px-4 zener-border zener-mt-3"
      />
    </div>
  );
};

const Default = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const __options = [
    {
      label: 'apple',
      value: 'apple',
    },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];
  return (
    <Select
      value={selected}
      onChange={(_, v) => {
        setSelected(v);
      }}
      options={async () => __options}
    />
  );
};

const Multiselect = () => {
  const [selected, setSelected] = useState<string[] | undefined>(['apple']);
  const options = [
    {
      label: 'apple',
      value: 'apple',
    },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];
  return (
    <Select
      creatable
      multiple
      searchable
      onSearch={(e) => {
        return false;
      }}
      value={selected}
      onChange={(_res, v) => {
        setSelected(v);
        console.log(v);
      }}
      options={async () => options}
    />
  );
};

const Group = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const options = [
    {
      label: 'Fruits',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Mango', value: 'mango' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { label: 'Potato', value: 'potato' },
        { label: 'Pumpkin', value: 'pumpkin' },
      ],
    },
    {
      label: 'Cereal',
      options: [
        { label: 'Maize', value: 'maize' },
        { label: 'rice', value: 'rice' },
        { label: 'Wheat', value: 'wheat' },
      ],
    },
  ];
  return (
    <Select
      value={selected}
      onChange={(res) => {
        setSelected(res.value);
      }}
      options={async () => options}
    />
  );
};

const Creatable = () => {
  const [selected, setSelected] = useState<string | undefined>('apple');
  const options = [
    { label: 'apple', value: 'apple' },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];
  return (
    <Select
      creatable
      value={selected}
      onChange={(res, v) => {
        setSelected(res.value);
        console.log(v);
      }}
      options={async () => options}
    />
  );
};

const Searchable = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  // const [options, setOptions] = useState([]);

  const options = [
    {
      label: 'apple',
      value: 'apple',
    },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];

  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <Select
      value={selected}
      onChange={(res) => {
        setSelected(res.value);
      }}
      options={async () => options}
      placeholder="searchable"
      searchable
      open
      onSearch={(t) => {
        console.log(t);
        return true;
      }}
    />
  );
};

const Asynchronous = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const options = async () => {
    const data = await (
      await fetch('https://jsonplaceholder.typicode.com/photos')
    ).json();
    return [...data.map((res: any) => ({ label: res.title, value: res.id }))];
  };

  return (
    <Select
      value={selected}
      onChange={(res) => {
        setSelected(res.value);
      }}
      options={options}
      placeholder="async"
    />
  );
};

const Clearable = () => {
  const [selected, setSelected] = useState<string[] | undefined>(undefined);

  const options = [
    {
      label: 'apple',
      value: 'apple',
    },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];
  return (
    <Select
      showclear
      multiple
      value={selected}
      onChange={(res) => {
        setSelected(res.map((r) => r.value));
      }}
      options={async () => options}
      placeholder="clearable"
    />
  );
};

const Customize = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const ___options = [
    {
      label: 'apple',
      value: 'apple',
    },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];

  const closeIcon = () => {
    return (
      <svg
        width="12"
        height="12"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M24 8 8 24M24 24 8 8"
        />
      </svg>
    );
  };

  const chevronDown = () => {
    return (
      <svg
        width="12"
        height="12"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M26 11 16 21 6 11"
        />
      </svg>
    );
  };

  return (
    <Select
      showclear
      multiple
      value={selected}
      onChange={(res) => {
        setSelected(res.map((r) => r.value));
      }}
      options={_f}
      placeholder={<div className="zener-text-white/50">Customize</div>}
      className={() => {
        const custom =
          'zener-bg-black zener-text-sm zener-text-white zener-px-2 zener-py-0.5 zener-border-solid zener-font-sans zener-border zener-rounded zener-min-w-[50px] zener-outline-none';
        return {
          default: `${custom} zener-border-stone-200`,
          focus: `${custom} zener-border-stone-200 zener-ring-1 zener-ring-orange-400`,
          disabled: `${custom} zener-text-black/25 zener-bg-black/5 zener-border-stone-100`,
        };
      }}
      suffixRender={({ clear, showclear }) => {
        return (
          <div className="zener-flex zener-flex-row zener-items-center zener-gap-1 zener-px-2">
            {showclear && selected && selected?.length > 0 && (
              <span
                className="zener-cursor-pointer hover:zener-opacity-60"
                onClick={clear}
              >
                {closeIcon()}
              </span>
            )}
            <span>{chevronDown()}</span>
          </div>
        );
      }}
      tagRender={({ label, remove, value }) => {
        return (
          <div className="zener-bg-yellow-600 zener-rounded zener-px-1.5 zener-truncate zener-py-0.5 zener-flex zener-flex-row zener-items-center zener-justify-center zener-gap-2">
            <span className="zener-truncate">{label}</span>
            <span
              className="zener-cursor-pointer hover:zener-opacity-60"
              onClick={() => remove(value)}
            >
              {closeIcon()}
            </span>
          </div>
        );
      }}
      menuClass="zener-bg-yellow-600 zener-p-1 zener-rounded zener-shadow-2xl"
      menuItemRender={({ label, innerProps, active, focused }: IOptionItem) => {
        return (
          <div className="zener-py-px zener-truncate" {...innerProps}>
            <div
              className={cn(
                'zener-py-2 zener-px-1 zener-rounded zener-truncate',
                {
                  'zener-bg-yellow-500': !!active,
                  'zener-bg-yellow-400': !!focused && !active,
                }
              )}
            >
              {label}
            </div>
          </div>
        );
      }}
      open
    />
  );
};

const Icons = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <Select
      value={selected}
      onChange={(res) => {
        setSelected(res.value);
      }}
      options={_country}
      placeholder="clearable"
      valueRender={(value) => (
        <div className="zener-flex zener-flex-row zener-items-center zener-gap-1">
          <span>{value.country.emoji}</span>
          <span>{value.label}</span>
        </div>
      )}
    />
  );
};

root.render(
  <div style={{ width: '200vw', height: '200vh' }}>
    <div
      style={{
        width: '50vw',
        marginLeft: '300px',
        marginTop: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <App />
      <Default />
      <Multiselect />
      {/* <Group /> */}
      {/* <Searchable /> */}
      <Creatable />
      {/* <Icons /> */}
      {/* 
      <Asynchronous />
      <Clearable /> */}
      {/* <Customize /> */}
      {/* <Select
        multiple
        // searchable
        // virtual={false}
        creatable
        value={undefined}
        // value={(await _country())[0]}
        disableWhileLoading
        // disabled

        onChange={(x) => {
          console.log(x);
        }}
        // open
        // disabled
        // valueRender={({ label, extra }) => (
        //   <div className="zener-flex zener-flex-row zener-gap-1 zener-items-center zener-truncate">
        //     <img
        //       className="zener-w-5 zener-h-5 zener-rounded"
        //       src={extra.image}
        //       alt={label}
        //     />
        //     <span className="zener-truncate">{label}</span>
        //   </div>
        // )}
        options={async () => _groupOptions}
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
            'zener-text-sm zener-px-2 zener-py-0.5 zener-border-solid zener-font-sans zener-border zener-rounded zener-min-w-[50px] zener-outline-none';
          return {
            default: `${c} zener-border-stone-200`,
            focus: `${c} zener-border-stone-200 zener-ring-1 zener-ring-orange-400`,
            disabled: `${c} zener-text-black/25 zener-bg-black/5 zener-border-stone-100`,
          };
        }}
        // menuItemRender={_MenuRenderer}
      /> */}
    </div>
  </div>
);

console.log(ReactDOMS.renderToString(<div>hello</div>));
