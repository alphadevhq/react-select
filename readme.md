# React Select

The React Select is a minimal select component for reactjs.

<img src="/images/minimial-example.png" alt="Minimal Example" style="max-height:250px">

## Table of Content
- [React Select](#react-select)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Customization](#customization)
- [Dealing with extra content](#dealing-with-extra-content)
- [The render function](#the-render-function)
- [Props](#props)
- [Types](#types)

## Installation

You can install the React Select component via [npm](https://www.npmjs.com/):

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
      onChange={(value) => {
        setSelected(value);
      }}
      options={async () => options}
    />
  );
};
```

<img src="/images/minimial-example.png" alt="Minimal Example" style="max-height:250px">

## Examples
#### MultiSelect

```jsx
const App = () => {
  const [selected, setSelected] = useState(undefined);
  const options = [
    { label: "apple", value: "apple" },
    { label: "ball", value: "ball" },
    { label: "cat", value: "cat" },
    { label: "dog", value: "dog" },
  ];
  return (
    <Select
      multiple
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={async () => options}
    />
  );
};
```
<img src="/images/multi-select.png" alt="Multiselect Example" style="max-height:250px">

#### Grouped
```jsx
const App = () => {
  const [selected, setSelected] = useState(undefined);
  const options = [
    {
      label: "Fruits",
      options: [
        { label: "Apple", value: "apple" },
        { label: "Mango", value: "mango" },
      ],
    },
    {
      label: "Vegetables",
      options: [
        { label: "Potato", value: "potato" },
        { label: "Pumpkin", value: "pumpkin" },
      ],
    },
    {
      label: "Cereal",
      options: [
        { label: "Maize", value: "maize" },
        { label: "rice", value: "rice" },
        { label: "Wheat", value: "wheat" },
      ],
    },
  ];
  return (
    <Select
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={async () => options}
    />
  );
};
```
<img src="/images/grouped.png" alt="Grouped Example" style="max-height:250px">

#### Searchable
```jsx
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
      searchable
      onSearch={() => true} // in order to enable built-in search `searchable` should be `true` and `onSearch` should return `true`. if you want custom search logic, return `false` in `onSearch` instead and apply your business logic inside it.
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={async () => options}
    />
  );
};
```
<img src="/images/searchable.png" alt="Searchable Example" style="max-height:250px">

#### Creatable
```jsx
const App = () => {
  const [selected, setSelected] = useState(undefined);
  const options = [
    { label: "apple", value: "apple" },
    { label: "ball", value: "ball" },
    { label: "cat", value: "cat" },
    { label: "dog", value: "dog" },
  ];
  return (
    <Select
      creatable
      multiple
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={async () => options}
    />
  );
};
```
<img src="/images/creatable.png" alt="Creatable Example" style="max-height:250px">



#### Asynchronous
```jsx
const App = () => {
  const [selected, setSelected] = useState(undefined);
  const options = async () => {
    const data = await (
      await fetch("fetch_api")
    ).json();
    return [...data.map((res) => ({ label: res.title, value: res.id }))];
  };

  return (
    <Select
      searchable
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={options}
    />
  );
};
```

#### Customization
```jsx
const App = () => {
  const [selected, setSelected] = useState([]);
  const options = [
    { label: "apple", value: "apple" },
    { label: "ball", value: "ball" },
    { label: "cat", value: "cat" },
    { label: "dog", value: "dog" },
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
      onChange={(value) => {
        setSelected(value);
      }}
      options={async ()=> options}
      
      placeholder={<div className="text-white/50">Customize</div>}
      
      className={() => {
        const custom =
          "bg-black text-sm text-white px-2 py-0.5 border-solid font-sans border rounded min-w-[50px] outline-none";
        return {
          default: `${custom} border-stone-200`,
          focus: `${custom} border-stone-200 ring-1 ring-orange-400`,
          disabled: `${custom} text-black/25 bg-black/5 border-stone-100`,
        };
      }}
      
      suffixRender={({ clear, showclear }) => {
        return (
          <div className="flex flex-row items-center gap-1 px-2">
            {showclear && selected && selected?.length > 0 && (
              <span className="cursor-pointer hover:opacity-60" onClick={clear}>
                {closeIcon()}
              </span>
            )}
            <span>{chevronDown()}</span>
          </div>
        );
      }}
      
      tagRender={({ label, remove, value }) => {
        return (
          <div className="bg-yellow-600 rounded px-1.5 truncate py-0.5 flex flex-row items-center justify-center gap-2">
            <span className="truncate">{label}</span>
            <span
              className="cursor-pointer hover:opacity-60"
              onClick={() => remove(value)}
            >
              {closeIcon()}
            </span>
          </div>
        );
      }}
      
      menuClass="bg-yellow-600 p-1 rounded shadow-2xl"
      
      menuItemRender={({ label, innerProps, active, focused }) => {
        return (
          <div className="py-px truncate" {...innerProps}>
            <div
              className={cn("py-2 px-1 rounded truncate", {
                "bg-yellow-500": !!active,
                "bg-yellow-400": !!focused && !active,
              })}
            >
              {label}
            </div>
          </div>
        );
      }}
    />
  );
};
```
<img src="/images/customize.png" alt="Customization Example" style="max-height:250px">


## Dealing with extra data
If you're handling additional data, React Select seamlessly supports it out of the box. Simply include your data alongside `{ label, value, ....your_extra_data_here }` for each item. For instance, consider the following example where `country`is included as extra data. This supplementary information can also be accessed upon triggering the `onChange` event.

```jsx
const countries = async () => {
  const data = await (
    await fetch(
      'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json'
    )
  ).json();

  return [
    ...data.map((country) => ({
      label: `${country.name}`,
      value: `${country.code}`,
      render: () => (
        <div className="flex flex-row items-center gap-1 truncate">
          <span>{country.emoji}</span>
          <span className="truncate">{country.name}</span>
        </div>
      ),
      country,
    })),
  ];
};

const App = () => {
  const [selected, setSelected] = useState(undefined);

  return (
    <Select
      value={selected}
      onChange={(value) => {
        setSelected(value);
      }}
      options={countries}
      valueRender={(value) => (
        <div className="flex flex-row items-center gap-1">
          <span>{value.country.emoji}</span>
          <span>{value.label}</span>
        </div>
      )}
    />
  );
};
```
<img src="/images/extra.png" alt="Extra data Example" style="max-height:250px">

## The render function
You have the option to include a render function alongside your items. Take this JSX snippet, for instance:
```jsx
{
  label: "Hello world",
  value: "hello",
  render: ({ active, focused }) => <div>Hello world</div>,
}
```
This feature empowers you to tailor each option item according to your preferences.

## Props

#### `options`

-   **Type**: `async () => [....]`
-   **Description**: Asynchronously retrieves selectable options for the Select component. Expects a function returning a Promise resolving to an array of objects representing options or a complex structure for grouped options, including labels and values.

#### `value`

-   **Type**: `(label:string, value:string, ...) | (label:string, options:{label:string, value:string, ...}[]) | array_of_items | undefined`
-   **Description**: Represents the current value(s) of the Select component. It should be object or array (multiple selection) of `label` and `value`.

#### `virtual?`

-   **Type**: `boolean`
-  **Default**: `true`
-   **Description**: Enables optimized rendering for handling large sets of options efficiently through virtual scrolling. Helps in rendering only visible options, improving performance.

#### `noOptionMessage?`

-   **Type**: `ReactNode`
-   **Description**: Customizable message or ReactNode to display when no options are available within the Select component.

#### `disableWhileLoading?`

-   **Type**: `boolean`
-  **Default**: `false`
-   **Description**: Disables the Select component while asynchronously fetching options to prevent interaction until options are loaded.

#### `placeholder?`

-   **Type**: `ReactNode`
-   **Description**: Placeholder text or ReactNode displayed when no option is selected.

#### `multiple?`

-   **Type**: `boolean`
-  **Default**: `false`
-   **Description**: Determines whether the Select component allows multiple options to be selected.

#### `open?`

-   **Type**: `boolean | undefined`
 -  **Default**: `false`
-   **Description**: Controls the visibility of the dropdown menu.

#### `disabled?`

-   **Type**: `boolean`
-   **Default**: `false`
-   **Description**: Disables the Select component when set to `true`.

#### `searchable?`

-   **Type**: `boolean`
-   **Default**: `false`
-   **Description**: Enables a search feature within the Select component to quickly find options.

#### `creatable?`

-   **Type**: `boolean`
-   **Default**: `false`
-   **Description**: Enables users to create new options within the Select component.

#### `showclear?`

-   **Type**: `boolean`
-   **Default**: `false`
-   **Description**: Displays a clear button for removing selected value(s).

#### `suffixRender?`

-   **Type**: `(value: ISuffixRender) => ReactNode`
-   **Description**: Allows customizing the appearance of the suffix area in the Select component.

#### `groupRender?`

-   **Type**: `(value: IGroupRender) => ReactNode`
-   **Description**: Enables custom rendering styles for group label.

#### `tagRender?`

-   **Type**: `(value: ITagRender) => ReactNode`
-   **Description**: Customizes the rendering style for selected tags, in multi-selection scenarios.

#### `menuItemRender?`

-   **Type**: `(value: IMenuItemRender) => ReactNode`
-   **Description**: Facilitates customization of individual menu item's renderings.

#### `valueRender?`

-   **Type**: `(value: type_of_item) => ReactNode`
-   **Description**: Customizes the rendering style for selected value in input field.

#### `className?`

-   **Type**: `string | (() => { focus?: string; disabled?: string; default?: string })`
-   **Description**: CSS classes for customizing select input field.

#### `portalClass?`

-   **Type**: `string`
-   **Description**: CSS classes for the portal element.

#### `menuClass?`

-   **Type**: `string`
-   **Description**: CSS classes for the dropdown menu container of the Select component.

#### `animation?`

-   **Type**: `null | AnimationProps(FramerMotion animation props)`
-   **Description**: Configures animations for the dropdown menu. When set null, disables the animation.

#### `onChange?`

-   **Type**: `(value:type_of_item) => void`
-   **Description**: Triggered upon changes to the selected value(s).

#### `onOpenChange?`

-   **Type**: `(open: boolean) => void`
-   **Description**: Triggered when the dropdown menu opens or closes.

#### `onSearch?`

-   **Type**: `(text: string) => void | boolean`
-   **Description**: Triggers when typing. If true is returned then it uses in-build filtering.

## Types
```ts
type ISuffixRender = {  
	showclear?:  boolean  |  undefined;  
	clear?: (() =>  void) |  undefined;  
	isOpen?:  boolean  |  undefined;  
	loading?:  boolean  |  undefined;  
}

type IGroupRender = {  
	label:  string;  
}

type ITagRender = {  
	remove: (value:  string) =>  void;  
	value:  string;  
	label:  string;  
}

type IOptionRender = string | (({ active, focused }: { active: boolean; focused: boolean }) => ReactNode);

type IMenuItemRender = {  
	active?:  boolean  |  undefined;  
	focused?:  boolean  |  undefined;  
	label:  string;  
	value:  string;  
	render: IOptionRender;  
	innerProps?: { ... } |  undefined;  
}

```
