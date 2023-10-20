import React from 'react';
import ReactDOM from 'react-dom/client';
import Option from './option';
import './scss/build.scss';
import Select from './select';

const options = [
  { label: 'hello', value: 'hi' },
  { label: 'apple', value: 'apple' },
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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="byte-p-3">
      <Select multiple searchable>
        {options.map((opt) => (
          <Option
            key={opt.value}
            label={opt.label}
            value={opt.value}
            className={(isActive) => {
              return isActive ? 'byte-bg-red-600' : '';
            }}
          >
            <div>{opt.label}</div>
          </Option>
        ))}
      </Select>
    </div>
  </React.StrictMode>
);
