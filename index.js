import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { isEqual, throttle } from 'lodash';

class ViewEvaluator extends React.Component {
  static hasLayouts = (layouts = []) => (
    layouts
      .reduce(
        (r, e) => (r && !!e),
        true,
      )
  );
  constructor(props) {
    super(props);
    const { children } = props;
    this.state = {
      children: [],
      layouts: [],
      evaluating: React.Children.count(
        children,
      ) > 0,
    };
    this.forceUpdate = throttle(
      this.forceUpdate,
      16,
    );
  }
  createMeasurementContainer = (child, { ...extraProps }) => (
    <View
      {...extraProps}
      removeClippedSubviews={false}
      collapsible={false}
      renderToHardwareTextureAndroid
    >
      {child}
    </View>
  );
  onLayoutsAccumulated = (layouts = []) => this.setState(
    {
      evaluating: false,
      children: [],
    },
  );
  shouldEvaluate = children => this.setState(
    {
      layouts: [
        ...Array(
          React.Children.count(children),
        ),
      ],
      children: React
        .Children
        .map(
          children,
          (child, i) => (
            this
              .createMeasurementContainer(
                child,
                {
                  key: `${i}`,
                  onLayout: ({ nativeEvent: { layout } }) => {
                    const { layouts } = this.state;
                    layouts[i] = layout;
                    if (ViewEvaluator.hasLayouts(layouts)) {
                      const { onLayoutsAccumulated } = this;
                      return onLayoutsAccumulated(
                        layouts,
                      );
                    }
                    return null;
                  }
                },
              )
          ),
        ),
    },
  );
  componentDidMount() {
    const { evaluating } = this.state;
    if (evaluating) {
      const { children } = this.props;
      return this.shouldEvaluate(
        children,
      );
    }
    return null;
  }
  render() {
    const {
      children,
      renderEvaluating,
      renderEvaluated,
      ...extraProps
    } = this.props;
    const {
      children: toBeEvaluated,
      layouts,
      evaluating,
    } = this.state;
    return (
      <>
        {(!!evaluating) && (
          <>
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: 0,
                },
              ]}
            >
              {toBeEvaluated}
            </View>
            {renderEvaluating()}
          </>
        )}
        {(!evaluating) && (
          React.Children.toArray(
            renderEvaluated(
              React.Children.toArray(
                children,
              )
                .map(
                  (child, i) => (
                    this.createMeasurementContainer(
                      child,
                      {
                        key: `${i}`,
                        onLayout: ({ nativeEvent: { layout } }) => {
                          if (!isEqual(layouts[i], layout)) {
                            layouts[i] = layout;
                            this.forceUpdate();
                          }
                        },
                      },
                    )
                  ),
                ),
              layouts,
            ),
          )
        )}
      </>
    );
  }
}

const styles = StyleSheet
  .create(
    {
      evaluating: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  );

ViewEvaluator.propTypes = {
  ...View.propTypes,
  renderEvaluating: PropTypes.func,
  renderEvaluated: PropTypes.func,
};

ViewEvaluator.defaultProps = {
  ...View.defaultProps,
  renderEvaluating: () => (
    <View
      style={styles.evaluating}
    >
      <ActivityIndicator
      />
    </View>
  ),
  renderEvaluated: (arrayOfChildren, layouts) => (
    <React.Fragment
    >
      {arrayOfChildren}
    </React.Fragment>
  ),
};

export default ViewEvaluator;
