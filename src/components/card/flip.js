import React, { useImperativeHandle } from 'react';
import { Platform, Animated } from 'react-native';
import styles from './flip.style';

export const CARD_SIDES = {
  BACK: 0,
  FRONT: 1,
};

const Flip = React.forwardRef((props, ref) => {
  const duration = 500;
  const perspective = 800;

  const [side, setSide] = React.useState(CARD_SIDES.BACK);
  const [sides, setSides] = React.useState(props.children);
  const [progress] = React.useState(new Animated.Value(0));
  const [zoom] = React.useState(new Animated.Value(0));
  const [rotation] = React.useState(new Animated.ValueXY({ x: 50, y: 50 }));

  React.useEffect(() => {
    setSides(props.children);
  }, [props.children]);

  useImperativeHandle(ref, () => ({
    flip: () => {
      flip();
    },
  }));
  const flip = () => {
    flipTo({
      x: 50,
      y: side === CARD_SIDES.BACK ? 100 : 50,
    });
    const newSide =
      side === CARD_SIDES.BACK ? CARD_SIDES.FRONT : CARD_SIDES.BACK;
    setSide(newSide);
  };

  const flipTo = toValue => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: side === CARD_SIDES.BACK ? 100 : 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(zoom, {
          toValue: 100,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotation, {
        toValue,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onFlipEnd(
        side === CARD_SIDES.BACK ? CARD_SIDES.FRONT : CARD_SIDES.BACK,
      );
    });
  };

  const getCardATransformation = () => {
    const sideAOpacity = progress.interpolate({
      inputRange: [50, 51],
      outputRange: [100, 0],
      extrapolate: 'clamp',
    });

    const sideATransform = {
      opacity: sideAOpacity,
      zIndex: side === CARD_SIDES.BACK ? CARD_SIDES.FRONT : CARD_SIDES.BACK,
      transform: [{ perspective: perspective }],
    };
    const aYRotation = rotation.y.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ['-180deg', '0deg', '180deg', '0deg'],
      extrapolate: 'clamp',
    });
    sideATransform.transform.push({ rotateY: aYRotation });
    return sideATransform;
  };

  const getCardBTransformation = () => {
    const sideBOpacity = progress.interpolate({
      inputRange: [50, 51],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const sideBTransform = {
      opacity: sideBOpacity,
      zIndex: side === CARD_SIDES.BACK ? CARD_SIDES.BACK : CARD_SIDES.FRONT,
      transform: [{ perspective: -1 * perspective }],
    };
    let bYRotation;
    if (Platform.OS === 'ios') {
      // cardB Y-rotation
      bYRotation = rotation.y.interpolate({
        inputRange: [0, 50, 100, 150],
        outputRange: ['0deg', '180deg', '0deg', '-180deg'],
        extrapolate: 'clamp',
      });
    } else {
      // cardB Y-rotation
      bYRotation = rotation.y.interpolate({
        inputRange: [0, 50, 100, 150],
        outputRange: ['0deg', '-180deg', '0deg', '180deg'],
        extrapolate: 'clamp',
      });
    }
    sideBTransform.transform.push({ rotateY: bYRotation });
    return sideBTransform;
  };

  const flipZoom = 0.09;
  const cardATransform = getCardATransformation();
  const cardBTransform = getCardBTransformation();

  const cardZoom = zoom.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1 + flipZoom],
    extrapolate: 'clamp',
  });

  const scaling = {
    transform: [{ scale: cardZoom }],
  };

  return (
    <Animated.View style={[props.style, scaling]}>
      <Animated.View style={[styles.cardContainer, cardATransform]}>
        {sides[0]}
      </Animated.View>
      <Animated.View style={[styles.cardContainer, cardBTransform]}>
        {sides[1]}
      </Animated.View>
    </Animated.View>
  );
});

export default Flip;
