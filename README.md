# react-native-view-evaluator
A React Native `<Component />` which can be used to determine the post-layout configuration of a `<View />`.

## What's the point?
Sometimes in React Native, it's important to know the dimensions of the content you're going to render, before you actually render it! Take the [`<FlatList/>`](https://facebook.github.io/react-native/docs/flatlist.html); it's important to know your `itemWidth` before you render the content, and it's impossibe to use layout `flex` to fill content; so a `<FlatList/>` which resizes to fill your content is out of the question. Until now at least.

## 🚀 Getting Started

Using [`npm`]():

```sh
npm install --save react-native-view-evaluator
```

Using [`yarn`]():

```sh
yarn add react-native-view-evaluator
```

## ✍️ Example

```javascript
import React from 'react';
import { FlatList, View } from 'react-native';

export default () => (
  <ViewEvaluator
    style={{
      width: 100,
      height: null,
    }}
    renderEvaluated={(arrayOfChildren, layouts) => {
      const maxHeight = Math.ceil(
        layouts
          .reduce(
            (v, { height }) => (
              Math.max(
                v,
                height,
              )
            ),
            Number.MIN_VALUE,
          ),
      );
      return (
        <FlatList
          renderItem={({ item: viewToRender, index }) => (
            <View
              key={index}
              style={{
                width: 100,
                height: maxHeight,
              }}
            >
              {viewToRender}
            </View>
          )}
          data={arrayOfChildren}
        />
      );
    }}
  >
    <Text
      numberOfLines={2}
    >
      {'There\'s no way to tell how big this content will be until we actually render it, you know?'}
    </View>
    <Text
      numberOfLines={1}
    >
      {'So, if you wanted a <FlatList/> to stretch to fill these elements, you\'d be a bit stuck.'}
    </View>
  <View>
);
```

As you can see, once the size of each `<View />` has been calculated, they each get passed as an array to the `renderEvaluated` method, alongside a matching array of the resultan layouts.


## ⚠️ Caveats
This is only really designed for simple components that do not do anything intense, or stateful with respect to your application state, during `componentDidMount`, i.e. an API call. This is because the components are effectively rendered first, before being passed into the `renderEvaluated` callback. You won't see the components during this operation, but they _will_ act as if they are visible.

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

