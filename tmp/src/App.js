import React from 'react';
import Evaluate from 'react-native-view-evaluator';
import { Animated, FlatList } from 'react-native';

export default class App extends React.Component {
  state = {
   height: 100,
  };
  componentDidMount() {
    setInterval(
      () => this.setState(
        {
          height: this.state.height + 1,
        },
      ),
      1,
    );
  }
  render() {
    const { height } = this.state;
    return (
      <Animated.View
        style={[
        ]}
      >
        <Evaluate
          renderEvaluated={(arrayOfChildren, layouts) => {
            const width = layouts
              .reduce(
                (res, { width }) => Math.max(res, width),
                Number.NEGATIVE_INFINITY,
              );
            const height = layouts
              .reduce(
                (res, { height }) => Math.max(res, height),
                Number.NEGATIVE_INFINITY,
              );
            return (
              <FlatList
                style={{
                  borderWidth: 10,
                  width,
                  height,
                }}
                renderItem={({ item, index: i }) => (
                  <Animated.View
                    style={{
                      ...layouts[i],
                      backgroundColor: 'orange',
                    }}
                  >
                    {arrayOfChildren[i]}
                  </Animated.View>
                )}
                data={arrayOfChildren}
                horizontal
              />
            );
          }}
        >
          <Animated.View
            style={{
              width: 500,
              height,
              backgroundColor: 'green',
            }}
          />
          <Animated.View
            style={{
              width: 500,
              height,
              backgroundColor: 'blue',
            }}
          />
        </Evaluate>
      </Animated.View>
    );
  }
}
