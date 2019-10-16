# react-native-view-evaluator
A React Native `<Component />` which can be used to determine the post-layout configuration of a `<View />`.

## What's the point?
Sometimes in React Native, it's important to know the dimensions of the content you're going to render, before you actually render it! Take the [`<FlatList/>`](https://facebook.github.io/react-native/docs/flatlist.html); it's important to know your `itemWidth` before you render the content, and it's impossibe to use layout `flex` to fill content; so a `<FlatList/>` which resizes to fill your content is out of the question.

Until now at least.

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

Below, we'll create a `<FlatList />` position in the centre of the screen. This will scale to fit the largest rendered `<View />`.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import Evaluate from 'react-native-view-evaluator';

const { width } = Dimensions
  .get('window');

const App = ({ strings }) => (
  <View
    style={[
      StyleSheet.absoluteFill,
      {
        alignItems: 'center',
        justifyContent: 'center',
      },
    ]}
  >
    <Evaluate 
      renderEvaluated={(arrayOfChildren, layouts) => {
        const height = layouts
          .reduce(
            (r, { height }) => Math.max(r, height),
            Number.NEGATIVE_INFINITY,
          ) + 10;
        return (
          <View
            style={{
              width,
              height,
            }}
          >
            <FlatList
              itemWidth={width}
              style={[
                {
                  width,
                  height,
                  borderWidth: 1,
                },
              ]}
              data={arrayOfChildren}
              renderItem={({ item, index }) => (
                item
              )}
              horizontal
              pagingEnabled
            />
          </View> 
        );
      }}
    >
      {strings
        .map(
          (s, i) => (
            <Text
              key={i}
              style={{
                width,
                height: null,
              }}
              children={s}
            />
          ),
        )}
    </Evaluate>
  </View>
);

App.propTypes = {
  strings: PropTypes.arrayOf(
    PropTypes.string,
  ),
};

App.defaultProps = {
  strings: [
    'This is a test string.',
    'This is also a test string, albeit a slightly longer one.',
    'We don\'t know how big these strings are going to be at render time.',
    'Which means we couldn\'t wrap them in <FlatList /> to scale to the maximum height',
    'This is the biggest string of all. This is useful to evaluate whether the rendered <FlatList/> is a giant box that has mostly empty space around all of the pages but this one.',
  ],
};

export default App;
```

As you can see, once the size of each `<View />` has been calculated, they each get passed as an array to the `renderEvaluated` method, alongside a matching array of the resultan layouts.


## ⚠️ Caveats
This is only really designed for simple components that do not do anything intense, or stateful with respect to your application state, during `componentDidMount`, i.e. an API call. This is because the components are effectively rendered first, before being passed into the `renderEvaluated` callback. You won't see the components during this operation, but they _will_ act as if they are visible.

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

