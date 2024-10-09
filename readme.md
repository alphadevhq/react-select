# React Select

The React Select is a customizable and accessible dropdown select component for reactjs, built from scratch for flexibility and performance. Supports single and multi-select options, with an intuitive API for easy integration.

<a href="https://react-select.ojhabikash.com.np/">Demo</a>


<img src="/images/minimial-example.png" alt="Minimal Example" style="max-height:250px">

## Table of Content
- [React Select](#react-select)
- [Documentation](https://react-select.ojhabikash.com.np/)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#Features)

## Installation

You can install the React Select component via [npm](https://www.npmjs.com/package/@oshq/react-select/):

```bash
npm i @oshq/react-select
```
## Usage

#### Basic Implementation

```jsx
import Select from '@oshq/react-select';
import '@oshq/react-select/index.css';

const App = () => {
  const [selected, setSelected] = useState(undefined);
  const options = [
    { label: 'apple', value: 'apple' },
    { label: 'ball', value: 'ball' },
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ];
  return (
    <Select
      value={selected}
      onChange={(_,val) => {
        setSelected(val);
      }}
      options={async () => options}
    />
  );
};
```

## Features
- Virtual Scrolling at it's core
- Customizable components support
- Typeahead support
- Complete keyboard navigation
- Multiple selection support
- Support for Asynchronous options loading
- Supports items, labels, groups of items
- Fully managed focus
- Written in TypeScript

